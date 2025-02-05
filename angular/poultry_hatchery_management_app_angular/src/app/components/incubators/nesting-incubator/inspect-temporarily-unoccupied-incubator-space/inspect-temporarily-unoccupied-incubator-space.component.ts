import { TasksService } from './../../../../services/tasks/tasks.service';
import { PostNestingTrolleyToIncubatorSpaceRequest } from './../../../../dto/post-nesting-trolley-to-incubator-space-request';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NestingTrolleyIncubatorSpaceAssignment } from '../../../../models/nesting-trolley-incubator-space-assignment.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../../../models/task.model';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NestingIncubatorService } from '../../../../services/nesting-incubator/nesting-incubator.service';
import { PutTaskRequest } from '../../../../dto/put-task-request';
import { BehaviorSubject, from, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomDateFormatterService } from '../../../../utils/date-format/custom-date-formatter.service';
import { CustomDateFormatterPipe } from '../../../../utils/date-format/custom-date-formatter.pipe';
import { TaskNestingTrolleyAssignment } from '../../../../models/task-nesting-trolley-assignment.model';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskType } from '../../../../models/task-type.model';
import { TaskTypeEntityNameValueForCandling, TaskTypeEntityNameValueForEmergence, TaskTypeEntityNameValueForHatching } from '../../../../app.config';

@Component({
  selector: 'app-inspect-temporarily-unoccupied-incubator-space',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomDateFormatterPipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './inspect-temporarily-unoccupied-incubator-space.component.html',
  styleUrl: './inspect-temporarily-unoccupied-incubator-space.component.css'
})
export class InspectTemporarilyUnoccupiedIncubatorSpaceComponent implements OnInit {

  assignmentOption: boolean = false;

  allAvailableAssginments: NestingTrolleyIncubatorSpaceAssignment[] | null = null;
  chosenAssignment$ = new BehaviorSubject<NestingTrolleyIncubatorSpaceAssignment | null>(null);

  availableTasks$!: Observable<Task[]>;
  selectedTasks: Task[] = [];

  constructor(
    private dialogRefParent: MatDialogRef<InspectTemporarilyUnoccupiedIncubatorSpaceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      selfAssignment: NestingTrolleyIncubatorSpaceAssignment,
      allAssignments: NestingTrolleyIncubatorSpaceAssignment[],
      tasks: Map<Task, TaskNestingTrolleyAssignment[]>
    },
    private incubatorService: NestingIncubatorService,
    private taskService: TasksService,
    private snackBar: MatSnackBar,
    private dateService: CustomDateFormatterService
  ){}

  ngOnInit(): void {
    this.chosenAssignment$.next(this.data.selfAssignment);
    this.availableTasks$ = this.chosenAssignment$.pipe(
      switchMap(assignment => {
        const arr = Array.from(this.data.tasks)
        .filter(([key, value]) => value[0].nestingTrolley.id === assignment?.nestingTrolley.id)
        .filter(([key, value]) => ![TaskTypeEntityNameValueForCandling, TaskTypeEntityNameValueForHatching, TaskTypeEntityNameValueForEmergence].includes(key.taskType.name))
        .map(([key]) => key);
        return of(arr);
      })
    )
    this.allAvailableAssginments = this.data.allAssignments
      .filter(it => !it.nestingIncubatorSpace.isCurrentlyOccupied)
      .filter(it => it.nestingTrolley.id !== this.data.selfAssignment.nestingTrolley.id)
      .sort((it1, it2) => it1.nestingTrolley.humanReadableId > it2.nestingTrolley.humanReadableId ? 1 : -1);
  }

  onAssignmentChange(assignment: NestingTrolleyIncubatorSpaceAssignment) {
    this.chosenAssignment$.next(assignment);
  }

  onDifferentAssignmentOption(option: boolean) {
    this.assignmentOption = option;
    if (option === false) {
      this.chosenAssignment$.next(this.data.selfAssignment);
    } else {
      this.chosenAssignment$.next(null);
    }
  }

  submitSelection() {
    let result$;
    if (this.chosenAssignment$.value) {

      if (this.assignmentOption) {
        result$ = this.postNestingTrolleyToIncubatorSpace(this.chosenAssignment$.value).pipe(
          switchMap(response => this.putTaskProgressOnTrolley(response.nestingTrolley.id, this.selectedTasks))
        ).subscribe();
        return this.dialogRefParent.close(result$);
      }

      result$ = this.incubatorService.putNestingTrolleyToIncubatorSpace(this.chosenAssignment$.value.id).pipe(
        switchMap(response => this.putTaskProgressOnTrolley(response.nestingTrolley.id, this.selectedTasks))
      ).subscribe();  
      return this.dialogRefParent.close(result$);

    } else {
      this.snackBar.open('Opps, coś poszło nie tak', 'Zamknij', {
        duration: 5000, // millis
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }

  onClose() {
    this.dialogRefParent.close();
  }


  private putTaskProgressOnTrolley(trolleyId: string, tasks: Task[]): Observable<any> {
    return from(tasks).pipe(
      mergeMap(task => {
        const body: PutTaskRequest = {
          nestingTrolleyId: trolleyId,
          taskId: task.id,
          isTaskCompleted: true
        }
        return this.taskService.putTaskProgressOnTrolley(body);
      })
    )
  }

  private postNestingTrolleyToIncubatorSpace(assignment: NestingTrolleyIncubatorSpaceAssignment): Observable<NestingTrolleyIncubatorSpaceAssignment> {
    const body: PostNestingTrolleyToIncubatorSpaceRequest = {
      nestingIncubatorSpaceId: this.data.selfAssignment.nestingIncubatorSpace.id, 
      nestingTrolleyId: assignment.nestingTrolley.id
    }
    return this.incubatorService.postNestingTrolleyToIncubatorSpace(body);
  }

}
