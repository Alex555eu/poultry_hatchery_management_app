import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NestingIncubatorService } from '../../../services/nesting-incubator/nesting-incubator.service';
import { NestingTrolleyIncubatorSpaceAssignment } from '../../../models/nesting-trolley-incubator-space-assignment.model';
import { NestingTrolleyContent } from '../../../models/nesting-trolley-content.model';
import { forkJoin, mergeMap, of, switchMap, tap, filter, from, BehaviorSubject, Observable, catchError } from 'rxjs';
import { NestingTrolleyService } from '../../../services/nesting-trolley/nesting-trolley.service';
import { Task } from '../../../models/task.model';
import { TasksService } from '../../../services/tasks/tasks.service';
import { TaskNestingTrolleyAssignment } from '../../../models/task-nesting-trolley-assignment.model';
import { IncubatorPrinterService } from '../../../utils/incubator-printer/incubator-printer.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NestingIncubator } from '../../../models/nesting-incubator.model';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { TasksSectionComponent } from '../../tasks/tasks-section/tasks-section.component';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { InspectOccupiedIncubatorSpaceComponent } from './inspect-occupied-incubator-space/inspect-occupied-incubator-space.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NestingIncubatorSpace } from '../../../models/nesting-incubator-space.model';
import { InspectTemporarilyUnoccupiedIncubatorSpaceComponent } from './inspect-temporarily-unoccupied-incubator-space/inspect-temporarily-unoccupied-incubator-space.component';
import { NestingTrolley } from '../../../models/nesting-trolley.model';
import { isNumberObject } from 'util/types';
import { InspectUnoccupiedIncubatorSpaceComponent } from './inspect-unoccupied-incubator-space/inspect-unoccupied-incubator-space.component';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-nesting-incubator',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatGridListModule,
    MatIconModule,
    TasksSectionComponent,
    MatDialogModule,
    MatButtonModule
    
],
  templateUrl: './nesting-incubator.component.html',
  styleUrl: './nesting-incubator.component.css'
})
export class NestingIncubatorComponent implements OnInit {

  incubator: NestingIncubator | null = null;
  incubatorSpaces: NestingIncubatorSpace[] = []
  
  private incubatorSpaceAssignments: NestingTrolleyIncubatorSpaceAssignment[] = [];
  private trolleysContent: NestingTrolleyContent[][] = [];

  private tasks: Task[] | null = null;
  private taskTrolleyAssignments: Map<Task, TaskNestingTrolleyAssignment[]> = new Map();

  todaysTasks: Task[] | null = null;
  uncompletedTasks: Task[] | null = null;

  @ViewChildren('tile') private tiles!: QueryList<ElementRef>;

  constructor(
    private nestingIncubatorService: NestingIncubatorService,
    private nestingTrolleyService: NestingTrolleyService,
    private tasksService: TasksService,
    private incubatorPrinterService: IncubatorPrinterService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void { 
    this.route.queryParamMap.pipe(
      switchMap(params => {
        const query = params.get('id');
        if (query)
          return this.nestingIncubatorService.getNestingIncubatorById(query);
        return [];
      }),
      switchMap(incubator => {
        this.incubator = incubator;
        this.getIncubatorSpaces(incubator);
        return this.getAllTrolleysCurrentlyInIncubator(incubator.id);
      })
    ).subscribe();
  }


  findTrolleySpaceAssignment(space: NestingIncubatorSpace): NestingTrolleyIncubatorSpaceAssignment | null{
    return this.incubatorSpaceAssignments?.find(it => it.nestingIncubatorSpace.id === space.id) || null;
  }


  getTileColorClass(space: NestingIncubatorSpace): string {
    let assignment: NestingTrolleyIncubatorSpaceAssignment | null = this.findTrolleySpaceAssignment(space);
    if (assignment) {
      if (assignment.nestingIncubatorSpace.isCurrentlyOccupied) {
          return 'currently-occupied'
      } 
      return 'used-but-not-occupied';
    }
    return 'empty';
  }


  inspectIncubatorSpace(space: NestingIncubatorSpace) {
    const assignment = this.findTrolleySpaceAssignment(space);
    if (assignment) {
      if (assignment.nestingIncubatorSpace.isCurrentlyOccupied) {
        this.incubatorSpaceCurrentlyOccupied(assignment);
      } else {
        this.incubatorSpaceCurrentlyUnoccupied(assignment);
      }
    } else {
      this.incubatorSpaceEmpty(space);
    }
  }
  
  
  highlightTrolleysBySelectedTask(taskId: string) {
    if (taskId === '') {
      this.tiles.forEach((tile) => {
          tile.nativeElement.style.pointerEvents = '';
          tile.nativeElement.style.opacity = '';
          tile.nativeElement.style.cursor = '';
      });
    } else {
      let task = this.tasks?.find(it => it.id === taskId);
      if (task){
        let trolleysAssignedWithRequestedTask = this.taskTrolleyAssignments
          .get(task)
          ?.filter(it => it.task.id === taskId)
          .map(it => it.nestingTrolley);
      
        let trolleyIds = trolleysAssignedWithRequestedTask?.map(trolley => trolley.id);
        let spaceIds = this.incubatorSpaceAssignments?.filter(
          it => trolleyIds?.includes(it.nestingTrolley.id)
        )
        .map(it => it.nestingIncubatorSpace.humanReadableId);
      
        this.tiles.forEach((tile) => {
          if (!spaceIds?.includes(tile.nativeElement.children[0].innerText)) {
            tile.nativeElement.style.pointerEvents = 'none';
            tile.nativeElement.style.opacity = '0.4';
            tile.nativeElement.style.cursor = 'not-allowed';
          }
        });
      }
    }
  }


  private incubatorSpaceCurrentlyOccupied(assignment: NestingTrolleyIncubatorSpaceAssignment) {
    let config = new MatDialogConfig();
    config.data = {
      trolley: assignment.nestingTrolley,
      trolleyContent: this.trolleysContent.find(it => it[0]?.nestingTrolley.id === assignment.nestingTrolley.id) || null
    }
    let dialogRef = this.dialog.open(InspectOccupiedIncubatorSpaceComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      switch (result) {
        case 'PERMANENT': {
          let ob$ = this.nestingIncubatorService.deleteNestingTrolleyFromIncubatorSpace(assignment.id);
          ob$.subscribe(() => {
              this.ngOnInit();
          })
          break;
        }
        case 'TEMPORARY': {
          let ob$ = this.nestingIncubatorService.putNestingTrolleyToIncubatorSpace(assignment.id);
          ob$.subscribe(response => {
            if (response) {
              this.ngOnInit();
            }
          })
          break;
        }
      }
    })
  }

  private incubatorSpaceCurrentlyUnoccupied(assignment: NestingTrolleyIncubatorSpaceAssignment) {
    let config = new MatDialogConfig();
    config.data = {
      selfAssignment: assignment,
      allAssignments: this.incubatorSpaceAssignments,
      tasks: this.taskTrolleyAssignments
    }
    let dialogRef = this.dialog.open(InspectTemporarilyUnoccupiedIncubatorSpaceComponent, config);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.ngOnInit();
      }
    })
  }


  private incubatorSpaceEmpty(incubatorSpace: NestingIncubatorSpace) {
    let config = new MatDialogConfig();
    config.data = {
      incubatorSpace: incubatorSpace
    }
    let dialogRef = this.dialog.open(InspectUnoccupiedIncubatorSpaceComponent, config);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.ngOnInit();
      }
    })
  }


  private getIncubatorSpaces(incubator: NestingIncubator) {
    let incubatorSpaces$ = this.nestingIncubatorService.getAllNestingIncubatorSpaces(incubator.id);
    incubatorSpaces$.subscribe(response => {
      this.incubatorSpaces =  this.incubatorPrinterService.getIncubatorLayout2(incubator.numberOfColumns, response); 
    });
  }


  private getAllTrolleysCurrentlyInIncubator(incubatorId: string): Observable<any> {
    return this.nestingIncubatorService.getAllTrolleysCurrentlyInIncubator(incubatorId).pipe(
      tap(response => {
        this.incubatorSpaceAssignments = response;
      }),
      switchMap(response => this.getTrolleyContents(response)),
      switchMap(() => this.getAllActiveTasksByIncubatorId(incubatorId))
    )
  }


  private getTrolleyContents(response: NestingTrolleyIncubatorSpaceAssignment[]): Observable<any> {
    return from(response).pipe(
      mergeMap(assignment => 
        this.nestingTrolleyService.getNestingTrolleyContent(assignment.nestingTrolley.id).pipe(
          tap(trolleyContentResponse => this.trolleysContent.push(trolleyContentResponse))
        )
      )
    );
  }


  private getAllActiveTasksByIncubatorId(incubatorId: string): Observable<any> {
    return this.tasksService.getAllActiveTasksByIncubatorId(incubatorId).pipe(
      tap(response => {
        this.tasks = response;
        this.todaysTasks = this.tasksService.filterTodaysTasks(response);
        this.uncompletedTasks = this.tasksService.filterOverdueTasks(response);
      }),
      switchMap(response => this.getAllTaskNestingTrolleyAssignmentsByTaskId(response)))
  }


  private getAllTaskNestingTrolleyAssignmentsByTaskId(response: Task[]): Observable<any> {
    this.taskTrolleyAssignments.clear();
    return from(response).pipe(
      mergeMap(task => 
        this.tasksService.getAllTaskNestingTrolleyAssignmentsByTaskId(task.id).pipe(
          tap(trolleyContentResponse => {
            this.taskTrolleyAssignments.set(
              task,
              (this.taskTrolleyAssignments.get(task) || []).concat(trolleyContentResponse)
            );                    
          })
        )
      )
    );
  }
  
}
