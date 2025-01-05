import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HatchingService } from '../../../services/hatching/hatching.service';
import { RejectionService } from '../../../services/rejections/rejection.service';
import { NestingTrolleyService } from '../../../services/nesting-trolley/nesting-trolley.service';
import { TasksService } from '../../../services/tasks/tasks.service';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { NestingLoadedDeliveriesService } from '../../../services/nesting-loaded-deliveries/nesting-loaded-deliveries.service';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { Hatching } from '../../../models/hatching.model';
import { RejectionPanelComponent } from '../../candling/open-candling/rejection-panel/rejection-panel.component';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { NestingTrolley } from '../../../models/nesting-trolley.model';
import { NestingTrolleyContent } from '../../../models/nesting-trolley-content.model';
import { TaskNestingTrolleyAssignment } from '../../../models/task-nesting-trolley-assignment.model';
import { FindTaskedTrolleysComponent } from '../../tasks/find-tasked-trolleys/find-tasked-trolleys.component';
import { HatchingTrolley } from '../../../models/hatching-trolley.model';
import { HatchingTrolleyContent } from '../../../models/hatching-trolley-content.model';
import { HatchingTrolleyService } from '../../../services/hatching-trolley/hatching-trolley.service';
import { InspectHatchingTrolleyComponent } from './inspect-hatching-trolley/inspect-hatching-trolley.component';
import { HatchingLoadedDeliveries } from '../../../models/hatching-loaded-deliveries.model';
import { AddHatchingTrolleyToHatchingComponent } from './add-hatching-trolley-to-hatching/add-hatching-trolley-to-hatching.component';
import { Rejection3PanelComponent } from './rejection3-panel/rejection3-panel.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-open-hatching',
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
    Rejection3PanelComponent,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './open-hatching.component.html',
  styleUrl: './open-hatching.component.css'
})
export class OpenHatchingComponent implements OnInit {

  @ViewChildren('trolleyListOptionContainers') trolleyListOptionContainers!: QueryList<ElementRef>;

  hatching: Hatching | null = null;

  nestingTrolleys: NestingTrolley[] | null = null;
  nestingTrolleyContentMapping = new Map<NestingTrolley, NestingTrolleyContent[]>();
  taskNestingTrolleyAssignment = new Map<NestingTrolley, TaskNestingTrolleyAssignment>();
  selectedNestingTrolley: NestingTrolley[] = []; // array, but always with only 1 value -> courtesy of a fricking angular material

  hatchingTrolleys: HatchingTrolley[] = [];
  selectedHatchingTrolley: HatchingTrolley[] = []; // same here
  hatchingTrolleyContentMapping = new Map<HatchingTrolley, HatchingTrolleyContent[]>();
  hatchingLoadedDeliveries: HatchingLoadedDeliveries[] = [];
  selectedHLD: HatchingLoadedDeliveries | null = null;

  rejectionCauses: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private hatchingService: HatchingService,
    private rejectionService: RejectionService,
    private nestingTrolleyService: NestingTrolleyService,
    private hatchingTrolleyService: HatchingTrolleyService,
    private taskService: TasksService,
    private dialog: MatDialog,
    private nldService: NestingLoadedDeliveriesService
  ){}

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      switchMap(params => {
        const query = params.get('id');
        if (query)
          return this.initHatching(query)
        return of();
      }),
      switchMap(hatching => this.initNestingTrolleys(hatching).pipe(map(() => hatching))),
      // switchMap(candling => this.initCandlingTrolleyAssignments(candling)),
      // switchMap(assignment => this.initTrolleyContent(assignment).pipe(map(() => assignment))), 
      switchMap(hatching => this.initTaskTrolleyAssignment(hatching.task.id).pipe(map(() => hatching))),
      switchMap(hatching => this.initHatchingTrolleys(hatching).pipe(map(() => hatching))),
      switchMap(hatching => this.initHLD(hatching).pipe(map(() => hatching))),
      switchMap(hatching => this.initRejectionCauses())
      // switchMap(assignment => this.initNestingLoadedDeliveries(assignment).pipe(map(() => assignment))),
      // switchMap(assignment => this.initRejections(assignment)),
      // switchMap(() => this.initRejectionCauses())

    ).subscribe();
  }

  updateAfterRejection(flag: boolean) {
    if (flag) {
      this.ngOnInit();
    }
  }

  addHatchingTrolleyToHatching() {
  let config = new MatDialogConfig();
  config.data = {
    hatchingId: this.hatching?.id
  }
  let ref = this.dialog.open(AddHatchingTrolleyToHatchingComponent, config);
  ref.afterClosed().subscribe(result => {
    if (result) {
      this.selectHatchingTrolley(result);
    }
  });
  }

  selectHatchingTrolley(hatchingTrolley: HatchingTrolley) {
    let config = new MatDialogConfig();
    config.data = {
      hatchingTrolley: hatchingTrolley,
      hatchingTrolleyContent: Array.from(this.hatchingTrolleyContentMapping.get(hatchingTrolley)?.values() || []),
      nestingTrolley: this.selectedNestingTrolley?.[0],
      nestingTrolleyContent: Array.from(this.nestingTrolleyContentMapping.get(this.selectedNestingTrolley?.[0])?.values() || []),
      hatchingLoadedDeliveries: this.hatchingLoadedDeliveries
    }
    let ref = this.dialog.open(InspectHatchingTrolleyComponent, config);
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit();
      }
    });
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

  countNestingTrolleyCapacity(trolley: NestingTrolley) {
    return this.nestingTrolleyContentMapping.get(trolley)?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }

  countHatchingTrolleyCapacity(trolley: HatchingTrolley) {
    return this.hatchingTrolleyContentMapping.get(trolley)?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }

  getTrolleyTaskStatusColor(nestingTrolley: NestingTrolley): string {
    let taskAssignment = this.taskNestingTrolleyAssignment?.get(nestingTrolley);
    if (taskAssignment) {
      return taskAssignment.isTaskCompleted ? '#44fd6cc5' : 'gray';
    }
    return 'transparent';
  }

  markAsCompleted(nestingTrolley: NestingTrolley) {
    let taskAssignment = this.taskNestingTrolleyAssignment?.get(nestingTrolley);
    if (taskAssignment) {
      this.taskService.putTaskProgressOnTrolley(
        {
          nestingTrolleyId: taskAssignment.nestingTrolley.id, 
          taskId: taskAssignment.task.id, 
          isTaskCompleted: true
        }).subscribe(response => {
          if (response) {
            taskAssignment.isTaskCompleted = true;
            if (this.taskNestingTrolleyAssignment) {
              this.taskNestingTrolleyAssignment.set(nestingTrolley, taskAssignment);
            }
          }
      });
    }
  }

  markAsUncompleted(nestingTrolley: NestingTrolley) {
    let taskAssignment = this.taskNestingTrolleyAssignment?.get(nestingTrolley);
    if (taskAssignment) {
      this.taskService.putTaskProgressOnTrolley(
        {
          nestingTrolleyId: taskAssignment.nestingTrolley.id, 
          taskId: taskAssignment.task.id, 
          isTaskCompleted: false
        }).subscribe(response => {
          if (response) {
            taskAssignment.isTaskCompleted = false;
            this.taskNestingTrolleyAssignment.set(nestingTrolley, taskAssignment);
          }
      });
    }
  }

  findTrolleyLocation(nestingTrolley: NestingTrolley) {
    let config = new MatDialogConfig();
    config.data = {
      assignments: [this.taskNestingTrolleyAssignment.get(nestingTrolley)]
    }
    this.dialog.open(FindTaskedTrolleysComponent, config);
  }



  private initHatching(hatchingId: string): Observable<Hatching> {
    return this.hatchingService.getHatchingById(hatchingId).pipe(
      tap(response => {
        if (response) {
          this.hatching = response;
        }
      })
    );
  }

  private initNestingTrolleys(hatching: Hatching): Observable<any> {
    return this.nestingTrolleyService.getNestingTrolleyContentByNestingId(hatching.nesting.id).pipe(
      tap(response => {
        let tmp = new Map<string, NestingTrolleyContent[]>();// string -> trolley id
        response.forEach(element => {
          const trolleyId = element.nestingTrolley.id;
          if (tmp.has(trolleyId)) {
            tmp.set(trolleyId, tmp.get(trolleyId)?.concat(element) || [element])
          } else {
            tmp.set(trolleyId, [element]);
          }
        })
        let trolleys: NestingTrolley[] = [];
        Array.from(tmp.keys()).forEach(element => {
          const trolley = tmp.get(element)![0]!.nestingTrolley;
          trolleys = trolleys.concat(trolley);
          this.nestingTrolleyContentMapping.set(trolley, tmp.get(element) || []);
        })
        this.nestingTrolleys = trolleys;
      })
    );
  }

  private initTaskTrolleyAssignment(taskId: string): Observable<any> {
    return this.taskService.getAllTaskNestingTrolleyAssignmentsByTaskId(taskId).pipe(
      tap(response => {
        if (response) {
          let res = new Map<NestingTrolley, TaskNestingTrolleyAssignment>();
          response.forEach(assignment => {
            const trolley = this.nestingTrolleys?.find(el => el.id === assignment.nestingTrolley.id);
            if (trolley) {
              res.set(trolley, assignment);
            } else {
              res.set(assignment.nestingTrolley, assignment);
            }
          })
          this.taskNestingTrolleyAssignment = res;
        }
      })
    );
  }

  private initHatchingTrolleys(hatching: Hatching): Observable<any> {
    return this.hatchingTrolleyService.getHatchingTrolleyContentByHatchingId(hatching.id).pipe(
      tap(response => {
        let tmp = new Map<string, HatchingTrolleyContent[]>();// string -> trolley id
        response.forEach(element => {
          const trolleyId = element.hatchingTrolley.id;
          if (tmp.has(trolleyId)) {
            tmp.set(trolleyId, tmp.get(trolleyId)?.concat(element) || [element])
          } else {
            tmp.set(trolleyId, [element]);
          }
        })
        let trolleys: HatchingTrolley[] = [];
        Array.from(tmp.keys()).forEach(element => {
          const trolley = tmp.get(element)![0]!.hatchingTrolley;
          trolleys = trolleys.concat(trolley);
          this.hatchingTrolleyContentMapping.set(trolley, tmp.get(element) || []);
        })
        this.hatchingTrolleys = trolleys;
      })
    );
  }

  private initHLD(hatching: Hatching): Observable<any> {
    return this.hatchingService.getHatchingLoadedDeliveriesByHatchingId(hatching.id).pipe(
      tap(response => {
        this.hatchingLoadedDeliveries = response;
      })
    );
  }

  private initRejectionCauses(): Observable<any> {
    return this.rejectionService.getPossibleRejection3Causes().pipe(
      tap(response => {
        if (response && response.length > 0) {
          this.rejectionCauses = response;
        }
      })
    )
  }

}
