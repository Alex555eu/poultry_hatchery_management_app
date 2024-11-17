import { PostNestingTrolleyToIncubatorSpaceRequest } from './../../../../dto/post-nesting-trolley-to-incubator-space-request';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NestingTrolley } from '../../../../models/nesting-trolley.model';
import { NestingIncubatorSpace } from '../../../../models/nesting-incubator-space.model';
import { Task } from '../../../../models/task.model';
import { NestingTrolleyIncubatorSpaceAssignment } from '../../../../models/nesting-trolley-incubator-space-assignment.model';
import { NestingIncubatorService } from '../../../../services/nesting-incubator/nesting-incubator.service';
import { TasksService } from '../../../../services/tasks/tasks.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NestingTrolleyService } from '../../../../services/nesting-trolley/nesting-trolley.service';
import { BehaviorSubject, catchError, from, mergeMap, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioGroup, MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PutTaskRequest } from '../../../../dto/put-task-request';
import { CustomDateFormatterPipe } from '../../../../utils/date-format/custom-date-formatter.pipe';

@Component({
  selector: 'app-inspect-unoccupied-incubator-space',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    CommonModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    CustomDateFormatterPipe
  ],
  templateUrl: './inspect-unoccupied-incubator-space.component.html',
  styleUrl: './inspect-unoccupied-incubator-space.component.css'
})
export class InspectUnoccupiedIncubatorSpaceComponent implements OnInit {

  allAvailableTrolleys$!: Observable<NestingTrolley[]>;
  selectedTrolley$ = new BehaviorSubject<NestingTrolley | null>(null);
  
  tasksBySelectedTrolley$!: Observable<Task[]>;
  fetchedTasks$: Map<NestingTrolley, Observable<Task[]>> = new Map();
  selectedTasks: Task[] = [];

  
  constructor(
    private dialogRefParent: MatDialogRef<InspectUnoccupiedIncubatorSpaceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      incubatorSpace: NestingIncubatorSpace
    },
    private incubatorService: NestingIncubatorService,
    private trolleyService: NestingTrolleyService,
    private taskService: TasksService,
    private snackBar: MatSnackBar
  ){}


  ngOnInit(): void {
    this.allAvailableTrolleys$ = this.trolleyService.getAllNestingTrolleysFromOutsideOfIncubators();
  
    this.tasksBySelectedTrolley$ = this.selectedTrolley$.pipe(
      switchMap(trolley =>
        trolley
          ? this.fetchedTasks$.get(trolley) || this.taskService.getAllActiveTasksByTrolleyId(trolley.id)
          : of([])
      ),
      tap(tasks => {
        const selectedTrolley = this.selectedTrolley$.getValue();
        if (selectedTrolley && !this.fetchedTasks$.has(selectedTrolley)) {
          this.fetchedTasks$.set(selectedTrolley, of(tasks));
        }
      })
    );
  }

  
  onTrolleySelectionChange(trolley: NestingTrolley | null): void {
    this.selectedTrolley$.next(trolley);
  }


  submitSelection() {
    if (this.selectedTrolley$.value){
      const body: PostNestingTrolleyToIncubatorSpaceRequest = {
        nestingTrolleyId: this.selectedTrolley$.value?.id,
        nestingIncubatorSpaceId: this.data.incubatorSpace.id
      }
      let ob$ = this.incubatorService.postNestingTrolleyToIncubatorSpace(body).pipe(
        switchMap((response) => this.putTaskProgressOnTrolley(response.nestingTrolley.id, this.selectedTasks))
      ).subscribe();

      this.dialogRefParent.close(ob$);

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
}
