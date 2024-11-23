import { PutTaskRequest } from './../../../dto/put-task-request';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, from, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { CandlingService } from '../../../services/candling/candling.service';
import { Candling } from '../../../models/candling.model';
import { CandlingNestingTrolleyAssignment } from '../../../models/candling-nesting-trolley-assignment.model';
import { RejectionService } from '../../../services/rejections/rejection.service';
import { Rejection2 } from '../../../models/rejection2.model';
import { NestingTrolleyContent } from '../../../models/nesting-trolley-content.model';
import { NestingTrolleyService } from '../../../services/nesting-trolley/nesting-trolley.service';
import { TasksService } from '../../../services/tasks/tasks.service';
import { TaskNestingTrolleyAssignment } from '../../../models/task-nesting-trolley-assignment.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { FindTaskedTrolleysComponent } from '../../tasks/find-tasked-trolleys/find-tasked-trolleys.component';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { RejectionPanelComponent } from './rejection-panel/rejection-panel.component';
import { NestingTrolley } from '../../../models/nesting-trolley.model';
import { RejectionPanelTotalComponent } from './rejection-panel-total/rejection-panel-total.component';
import { SwapTrolleyContentsComponent } from './swap-trolley-contents/swap-trolley-contents.component';


@Component({
  selector: 'app-open-candling',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    CommonModule,
    MatMenuModule,
    MatListModule,
    FormsModule,
    MatDividerModule,
    MatDialogModule,
    RejectionPanelComponent,
    RejectionPanelTotalComponent
  ],
  templateUrl: './open-candling.component.html',
  styleUrl: './open-candling.component.css'
})
export class OpenCandlingComponent implements OnInit {

  @ViewChildren('trolleyListOptionContainers') trolleyListOptionContainers!: QueryList<ElementRef>;

  candling = new BehaviorSubject<Candling|null>(null);
  candlingNestingTrolleyAssignment: CandlingNestingTrolleyAssignment[] | null=null;

  selectedTrolley: CandlingNestingTrolleyAssignment[] | null = null;


  trolleyRejection = new Map<CandlingNestingTrolleyAssignment, Rejection2[]>();
  trolleyContent = new Map<CandlingNestingTrolleyAssignment, NestingTrolleyContent[]>();

  quantityOfAllEggsAtTheBeginningOfCandling: number = -1;

  rejectionCauses: string[] = [];

  taskTrolleyAssignment = new Map<CandlingNestingTrolleyAssignment, TaskNestingTrolleyAssignment>();

  selectedTrolleyContent: NestingTrolleyContent | null = null;

  trolleyContentQuantityPercentage = new Map<NestingTrolleyContent, number>();
  trolleyRejectedContentQuantityPercentage = new Map<NestingTrolleyContent, number>();

  rejectedContentTotal = new Map<CandlingNestingTrolleyAssignment, number>();

  

  constructor(
    private route: ActivatedRoute,
    private candlingService: CandlingService,
    private rejectionservice: RejectionService,
    private nestingTrolleyService: NestingTrolleyService,
    private taskService: TasksService,
    private dialog: MatDialog,
  ){}



  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      switchMap(params => {
        const query = params.get('id');
        if (query)
          return this.initCandling(query)
        return of();
      }),
      switchMap(candling => this.initCandlingTrolleyAssignments(candling)),
      switchMap(assignment => this.initTrolleyContent(assignment).pipe(map(() => assignment))), 
      switchMap(assignment => this.initTaskTrolleyAssignment(assignment).pipe(map(() => assignment))),
      switchMap(assignment => this.initRejections(assignment)),
      switchMap(() => this.initRejectionCauses())

    ).subscribe();
  }




///////////////////////////// HTML METHODS LOCAL (BY SELECTED TROLLEY) ///////////////////////////////

updateRejectionAndNestingTrolleyContent(flag: boolean) {
  if (flag && this.candlingNestingTrolleyAssignment) {
    this.initTrolleyContent(this.candlingNestingTrolleyAssignment).subscribe();
    this.initRejections(this.candlingNestingTrolleyAssignment).subscribe();
  }
}

getRejectedContentPercentage(content: NestingTrolleyContent): number {
  if (this.selectedTrolley && this.selectedTrolley.length > 0) {
    let rejections = this.trolleyRejection.get(this.selectedTrolley[0])?.filter(it => it.nestingTrolleyContent.id === content.id);

    let rejectSum = rejections?.reduce((sum, item) => sum + item.quantity, 0) || -1;
  
    return Math.ceil(rejectSum*100/content.nestingTrolley.maxCapacity);
  }
  return -1;
}

getContentPercentage(content: NestingTrolleyContent): number {
  if (this.selectedTrolley && this.selectedTrolley.length > 0) {
    return Math.floor((content.quantity)*100/content.nestingTrolley.maxCapacity);
  }
  return -1;
}


selectContent(selectedTrolleyContent: NestingTrolleyContent) {
  this.selectedTrolleyContent = selectedTrolleyContent;
}


getTrolleyContent(assignment: CandlingNestingTrolleyAssignment[] | null) {
  if (assignment) {
    return this.trolleyContent.get(assignment[0]);
  }
  return [];
}




//////////////////////////////// HTML METHODS GLOBAL ///////////////////////////////////////

getAllNestingTrolleyContent(): NestingTrolleyContent[] {
  return Array.from(this.trolleyContent.values()).flat();
}

getAllRejections(): Rejection2[] {
  return Array.from(this.trolleyRejection.values()).flat();
}

  markAsCompleted(candlingAssignment: CandlingNestingTrolleyAssignment) {
    let taskAssignment = this.taskTrolleyAssignment.get(candlingAssignment);
    if (taskAssignment) {
      this.taskService.putTaskProgressOnTrolley(
        {
          nestingTrolleyId: taskAssignment.nestingTrolley.id, 
          taskId: taskAssignment.task.id, 
          isTaskCompleted: true
        }).subscribe(response => {
          if (response) {
            taskAssignment.isTaskCompleted = true;
            this.taskTrolleyAssignment.set(candlingAssignment, taskAssignment);
          }
      });
    }
  }

  markAsUncompleted(candlingAssignment: CandlingNestingTrolleyAssignment) {
    let taskAssignment = this.taskTrolleyAssignment.get(candlingAssignment);
    if (taskAssignment) {
      this.taskService.putTaskProgressOnTrolley(
        {
          nestingTrolleyId: taskAssignment.nestingTrolley.id, 
          taskId: taskAssignment.task.id, 
          isTaskCompleted: false
        }).subscribe(response => {
          if (response) {
            taskAssignment.isTaskCompleted = false;
            this.taskTrolleyAssignment.set(candlingAssignment, taskAssignment);
          }
      });
    }
  }


  findTrolleyLocation(assignment: CandlingNestingTrolleyAssignment) {
    let config = new MatDialogConfig();
    config.data = {
      assignments: [this.taskTrolleyAssignment.get(assignment)]
    }
    this.dialog.open(FindTaskedTrolleysComponent, config);
  }

  
  swapTrolleyContents(assignment: CandlingNestingTrolleyAssignment) {
    const config = new MatDialogConfig();
    config.data = {
      selectedAssignment: assignment,
      allAssignments: this.candlingNestingTrolleyAssignment,
      allTrolleyContents: this.trolleyContent
    }
    const dialogRef = this.dialog.open(SwapTrolleyContentsComponent, config);
    dialogRef.afterClosed().subscribe(response => {
      if(response) {
        this.updateRejectionAndNestingTrolleyContent(true);
      }
    })
  }

  countTrolleyCapacity(assignment: CandlingNestingTrolleyAssignment): number {
    return this.trolleyContent.get(assignment)?.reduce((sum, item) => sum + item.quantity, 0) || -1
  }


  selectTrolley(element: HTMLDivElement) {
    const bgColor = 'lightgray'
    this.trolleyListOptionContainers.forEach(item => {
      if (item.nativeElement.style.backgroundColor === bgColor) {
        item.nativeElement.style.backgroundColor = ''
      }
    });
    element.style.backgroundColor = bgColor;
  }


  getTrolleyTaskStatusColor(candlingAssignment: CandlingNestingTrolleyAssignment): string {
    let taskAssignment = this.taskTrolleyAssignment.get(candlingAssignment);
    if (taskAssignment) {
      return taskAssignment.isTaskCompleted ? '#44fd6cc5' : 'gray';
    }
    return 'transparent';
  }


  //////////////////////////////// INIT METHODS ///////////////////////////////////////


  private initTaskTrolleyAssignment(assignments: CandlingNestingTrolleyAssignment[]): Observable<TaskNestingTrolleyAssignment[]> {
    const taskId = assignments[0]?.candling.task.id;
    return this.taskService.getAllTaskNestingTrolleyAssignmentsByTaskId(taskId).pipe(
      tap(response => {
        if (response) {
          let res = new Map<CandlingNestingTrolleyAssignment, TaskNestingTrolleyAssignment>();
          for(let it of response) {
            for(let it2 of assignments) {
              if (it.nestingTrolley.id === it2.nestingTrolley.id) {
                res.set(it2, it);
                break;
              }
            }
          }
          this.taskTrolleyAssignment = res;
        }
      })
    );
  }


  private initCandling(candlingId: string): Observable<Candling> {
    return this.candlingService.getCandlingById(candlingId).pipe(
      tap(response => {
        if (response) {
          this.candling.next(response);
        }
      })
    )
  }


  private initCandlingTrolleyAssignments(candling: Candling): Observable<CandlingNestingTrolleyAssignment[]> {
    return this.candlingService.getAllCandlingTrolleyAssignments(candling.id).pipe(
      tap(response => {
        if (response) {
          //this.candlingNestingTrolleyAssignment.next(response);
          this.candlingNestingTrolleyAssignment = response;
        }
      })
    )
  } 


  private initRejectionCauses(): Observable<any> {
    return this.rejectionservice.getPossibleRejection2Causes().pipe(
      tap(response => {
        if (response && response.length > 0) {
          this.rejectionCauses = response;
        }
      })
    );
  }


  private initRejections(assignment: CandlingNestingTrolleyAssignment[]): Observable<any> {
    const candlingId = assignment[0].candling.id;
    return this.rejectionservice.getAllRejection2(candlingId).pipe(
      tap(response => {
        if (response) {
          let newMap = new Map<CandlingNestingTrolleyAssignment, Rejection2[]>();
          response.forEach(rejections => {
            const cnta = assignment.find(it => it.id === rejections.candlingNestingTrolleyAssignment.id) || rejections.candlingNestingTrolleyAssignment;
            if (newMap.has(cnta)) {
              newMap.set(cnta, newMap.get(cnta)?.concat(rejections) || []);
            } else {
              newMap.set(cnta, [rejections]);
            }
          })
          this.trolleyRejection = newMap;
        }
      })
    );
  }


  private initTrolleyContent(assignments: CandlingNestingTrolleyAssignment[]): Observable<NestingTrolleyContent[]> {
    this.trolleyContent.clear();
    return from(assignments).pipe(
      mergeMap(assignment => this.nestingTrolleyService.getNestingTrolleyContent(assignment.nestingTrolley.id).pipe(
        tap(response => {
          if (response) {
            //this.trolleyContent = [...(this.trolleyContent || []), ...response];
            response.forEach(content => {
              if (this.trolleyContent.has(assignment)) {
                this.trolleyContent.set(assignment, this.trolleyContent.get(assignment)?.concat(content) || []);
              } else {
                this.trolleyContent.set(assignment, [content]);
              }
            })
          }
        })
      ))
    )
  }

  

}

