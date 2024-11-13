import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NestingIncubatorService } from '../../../services/nesting-incubator/nesting-incubator.service';
import { NestingTrolleyIncubatorSpaceAssignment } from '../../../models/nesting-trolley-incubator-space-assignment.model';
import { NestingTrolleyContent } from '../../../models/nesting-trolley-content.model';
import { forkJoin, mergeMap, of, switchMap, tap, filter, from } from 'rxjs';
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

  incubatorSpaceAssignments: NestingTrolleyIncubatorSpaceAssignment[] | null = null;

  trolleysContent: NestingTrolleyContent[][] = [];

  tasks: Task[] | null = null;
  taskTrolleyAssignments: Map<Task, TaskNestingTrolleyAssignment[]> = new Map();

  outputTiles: string[] | null = null;

  todaysTasks: Task[] | null = null;
  uncompletedTasks: Task[] | null = null;

  @ViewChildren('tile') tiles!: QueryList<ElementRef>;

  constructor(
    private nestingIncubatorService: NestingIncubatorService,
    private nestingTrolleyService: NestingTrolleyService,
    private tasksService: TasksService,
    private incubatorPrinterService: IncubatorPrinterService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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
        this.outputTiles = this.incubatorPrinterService.getIncubatorLayout(incubator.maxCapacity, incubator.numberOfColumns);
        let assignment$ = this.nestingIncubatorService.getAllTrolleysCurrentlyInIncubator(incubator.id);
        return assignment$.pipe(
          tap(response => {
            this.incubatorSpaceAssignments = this.sortByHumanReadableId(response);
          }),
          switchMap(response => {
            return from(response).pipe(
              mergeMap(assignment => 
                this.nestingTrolleyService.getNestingTrolleyContent(assignment.nestingTrolley.id).pipe(
                  tap(trolleyContentResponse => this.trolleysContent.push(trolleyContentResponse))
                )
              )
            );
          })
        )
      })
    ).subscribe();
    let tasks$ = this.tasksService.getAllActiveTasks();
    tasks$.pipe(
      tap(response => {
        this.tasks = response;
        this.todaysTasks = this.tasksService.filterTodaysTasks(response);
        this.uncompletedTasks = this.tasksService.filterOverdueTasks(response);
      }),
      switchMap(response => {
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
      })
    ).subscribe();
  }

  findNestingTrolleyIncubatorSpaceAssignmentByHumanReadableId(id: string): NestingTrolleyIncubatorSpaceAssignment | null{
    return this.incubatorSpaceAssignments?.find(it => it.nestingIncubatorSpace.humanReadableId === id) || null;
  }

  getTileColorClass(spaceId: string): string {
    let assignment: NestingTrolleyIncubatorSpaceAssignment | null = this.findNestingTrolleyIncubatorSpaceAssignmentByHumanReadableId(spaceId);
    if (assignment) {
      if (assignment.nestingIncubatorSpace.isCurrentlyOccupied) {
          return 'currently-occupied'
      } else {
          return 'used-but-not-occupied';
      }
    }
    return 'empty';
  }

  inspectIncubatorSpace(spaceId: string) {
    const assignment = this.findNestingTrolleyIncubatorSpaceAssignmentByHumanReadableId(spaceId);
    if (assignment) {
      if (assignment.nestingIncubatorSpace.isCurrentlyOccupied) {
        this.trolleyCurrentlyInIncubator(assignment);
      } else {
        //todo: implment component for serving trolley that resides in incubator, 
        //      but not currently (backend remembers last trolley and waits for it by default, unless we forbid it)
        
      }
    } else {
      //todo: implment component for serving empty incubaotr space
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

  private trolleyCurrentlyInIncubator(assignment: NestingTrolleyIncubatorSpaceAssignment) {
    let config = new MatDialogConfig();
    config.data = {
      trolleyContent: this.trolleysContent.find(it => it[0].nestingTrolley.id === assignment.nestingTrolley.id) || null
    }
    let dialogRef = this.dialog.open(InspectOccupiedIncubatorSpaceComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      // result = 'PERMANENT' | 'TEMPORARY'
      switch (result) {
        case 'PERMANENT': {
          let ob$ = this.nestingIncubatorService.deleteNestingTrolleyFromIncubatorSpace(assignment.id);
          ob$.subscribe(result => {
            if (result) {
              location.reload();
            }
          })
          break;
        }
        case 'TEMPORARY': {
          let ob$ = this.nestingIncubatorService.putNestingTrolleyToIncubatorSpace(assignment.id);
          ob$.subscribe(result => {
            if (result) {
              location.reload();
            }
          })
          break;
        }
      }
    })
  }


 private sortByHumanReadableId(assignments: NestingTrolleyIncubatorSpaceAssignment[]): NestingTrolleyIncubatorSpaceAssignment[]{
  return assignments.sort((it1, it2) => 
    it1.nestingIncubatorSpace.humanReadableId > it2.nestingIncubatorSpace.humanReadableId ? 1 : -1
  );    
} 


}
