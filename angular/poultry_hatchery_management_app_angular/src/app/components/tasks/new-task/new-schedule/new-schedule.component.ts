import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TasksService } from '../../../../services/tasks/tasks.service';
import { TaskScheduleDetails } from '../../../../models/task-schedule-details.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TaskType } from '../../../../models/task-type.model';
import { from, Observable, of, switchMap, tap } from 'rxjs';
import { TaskSchedule } from '../../../../models/task-schedule.model';

@Component({
  selector: 'app-new-schedule',
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
  ],
  templateUrl: './new-schedule.component.html',
  styleUrl: './new-schedule.component.css'
})
export class NewScheduleComponent implements OnInit {

  scheduleTitle: string = '';

  taskTypes: TaskType[] = [];
  selectedTaskType: TaskType | null = null;

  offset: number = 0;

  details: TaskScheduleDetails[] = [];

  constructor(
    private dialogRefParent: MatDialogRef<NewScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      taskTypes: TaskType[]
    },
    private tasksService: TasksService
  ) {}

  ngOnInit(): void {
    if (this.data){
      this.taskTypes = this.data.taskTypes;
    }
  }

  addDetail() {
    if (this.selectedTaskType) {
      let newDetail = new TaskScheduleDetails('', this.details.length+1, this.offset, null!, this.selectedTaskType);
      this.details = this.details.concat(newDetail);

      this.selectedTaskType = null;
      this.offset = 0;
    }
  }

  submit() {
    if (this.scheduleTitle !== '' && this.details.length > 0) {
      this.tasksService.postTaskSchedule(this.scheduleTitle).pipe(
        tap(schedule => {
          if(schedule) {
            for(let i = 0; i < this.details.length; i++) {
              const detail = this.details[i];
              this.tasksService.postTaskScheduleDetail(schedule.id, detail.taskType.id, i+1, detail.daysOffsetFromPrevTask).subscribe();
            }
            this.dialogRefParent.close(true);
          }
        })
      ).subscribe();
    }
  }

  closeDialog() {
    this.dialogRefParent.close();
  }



}
