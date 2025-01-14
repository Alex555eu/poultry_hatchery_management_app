import { MatTabsModule } from '@angular/material/tabs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TasksService } from '../../../services/tasks/tasks.service';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Nesting } from '../../../models/nesting.model';
import { NestingService } from '../../../services/nesting/nesting.service';
import { response } from 'express';
import { TaskType } from '../../../models/task-type.model';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TaskSchedule } from '../../../models/task-schedule.model';
import { TaskScheduleDetails } from '../../../models/task-schedule-details.model';
import { forkJoin, from, mergeMap, tap } from 'rxjs';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatTabsModule
  ],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css'
})
export class NewTaskComponent implements OnInit {
  
  nestingId: string = '';
  taskTypeId: string = '';
  executionDateTime: Date | null = null;
  comment: string = '';

  nestings: Nesting[] = [];
  taskTypes: TaskType[] = [];

  taskSchedule: TaskSchedule[] = [];
  selectedTaskSchedule: TaskSchedule | null = null;
  dateOfScheduleFirstTask: Date | null = null;
  scheduleNestingId: string = '';
  taskScheduleDetails = new Map<TaskSchedule, TaskScheduleDetails[]>();

  constructor(
    private dialogRefParent: MatDialogRef<NewTaskComponent>,
    private taskService: TasksService,
    private nestingService: NestingService
  ) {}

  ngOnInit(): void {
    this.loadNestings();
    this.loadTaskTypes();
    this.initTaskSchedules();
  }


  onSubmit(): void {
    if (this.nestingId && this.taskTypeId && this.executionDateTime) {
      const localDate = new Date(this.executionDateTime);
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());

      this.taskService.postTask({
        nestingId: this.nestingId,
        taskTypeId: this.taskTypeId,
        executionDateTime: localDate,
        comment: this.comment
      }).subscribe(response => {
        if (response) {
          this.dialogRefParent.close();
        }
      });
    }
  }

  newSchedule() {

  }

  onScheduleSubmit() {
    if (this.scheduleNestingId && this.selectedTaskSchedule && this.dateOfScheduleFirstTask){
      this.taskService.postTaskBySchedule(this.scheduleNestingId, this.selectedTaskSchedule.id, this.dateOfScheduleFirstTask).subscribe(response => {
        this.dialogRefParent.close(true);
      })
    }
  }

  closeDialog(): void {
    this.dialogRefParent.close();
  }

  selectTaskSchedule(element: TaskSchedule) {
    this.selectedTaskSchedule = element;
  }

  private loadNestings(): void {
    this.nestingService.getAllUnfinishedNestings().subscribe(response => {
      if (response && Array.isArray(response)) {
        this.nestings = response;
      }
    });
  }

  private loadTaskTypes(): void {
    this.taskService.getAllTaskTypes().subscribe(response => {
      if (response && Array.isArray(response)) {
        this.taskTypes = response;
      }
    });
  }

  private initTaskSchedules() {
    this.taskService.getAllTaskSchedules().pipe(
      tap(response => {
        if(response) {
          this.taskSchedule = response;
          this.selectedTaskSchedule = response[0];
          
          this.taskScheduleDetails.clear();
          response.forEach(item => {
            this.taskService.getAllTaskScheduleDetails(item.id).subscribe(response => {
              this.taskScheduleDetails.set(item, response);
            })
          })
        }
      })
    ).subscribe();
  }
}
