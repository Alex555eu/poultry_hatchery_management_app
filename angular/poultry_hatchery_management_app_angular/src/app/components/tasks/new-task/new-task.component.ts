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
    CommonModule
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

  constructor(
    private dialogRefParent: MatDialogRef<NewTaskComponent>,
    private taskService: TasksService,
    private nestingService: NestingService
  ) {}

  ngOnInit(): void {
    this.loadNestings();
    this.loadTaskTypes();
  }

  loadNestings(): void {
    this.nestingService.getAllUnfinishedNestings().subscribe(response => {
      if (response && Array.isArray(response)) {
        this.nestings = response;
      }
    });
  }

  loadTaskTypes(): void {
    this.taskService.getAllTaskTypes().subscribe(response => {
      if (response && Array.isArray(response)) {
        this.taskTypes = response;
      }
    });
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

  closeDialog(): void {
    this.dialogRefParent.close();
  }

}
