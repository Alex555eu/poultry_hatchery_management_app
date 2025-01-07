import { Component, Inject, OnInit } from '@angular/core';
import { Nesting } from '../../../models/nesting.model';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../../models/task.model';
import { NestingService } from '../../../services/nesting/nesting.service';
import { EmergenceService } from '../../../services/emergence/emergence.service';
import { TasksService } from '../../../services/tasks/tasks.service';
import { Router } from '@angular/router';
import { CustomDateFormatterPipe } from '../../../utils/date-format/custom-date-formatter.pipe';
import { Hatching } from '../../../models/hatching.model';
import { TaskTypeEntityNameValueForEmergence } from '../../../app.config';
import { PostTaskRequest } from '../../../dto/post-task-request';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PostEmergenceRequest } from '../../../dto/post-emergence-request';

@Component({
  selector: 'app-new-emergence',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    CustomDateFormatterPipe    
  ],
  templateUrl: './new-emergence.component.html',
  styleUrl: './new-emergence.component.css'
})
export class NewEmergenceComponent implements OnInit {

  nestings = new BehaviorSubject<Nesting[]|null>(null);

  selectedNesting: Nesting | null = null;

  constructor(
    private dialogRefParent: MatDialogRef<NewEmergenceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      task: Task
    },
    private emergenceService: EmergenceService,
    private nestingService: NestingService,
    private taskService: TasksService,
    private router: Router,
    private datePipe: CustomDateFormatterPipe
  ){}

  ngOnInit(): void {
    if (!this.data) {
      this.nestingService.getAllUnfinishedNestings()
      .subscribe(response => {
        if (response) {
          this.nestings.next(response);
        }
      })
    } else {
      this.selectedNesting = this.data.task.nesting;
    }
  }

 onSubmit() {
    if (this.selectedNesting) {
      if (!this.data){
        this.getTaskType().subscribe(response => {
          if (response) {
            this.router.navigate(['emergence/open'], { queryParams: { id: response.id } });
          } 
          this.dialogRefParent.close(null);
        })
      } else {
        this.postEmergence(this.data.task).subscribe(response => {
          if (response) {
            this.router.navigate(['emergence/open'], { queryParams: { id: response.id } });
          } 
          this.dialogRefParent.close(null);
        })
      }
    }
  }
  
  
  private getTaskType(): Observable<Hatching> {
    return this.taskService.getAllTaskTypes().pipe(
      switchMap(response => {
        if (response) {
          const taskType = response.find(it => it.name === TaskTypeEntityNameValueForEmergence) || null;
          if (taskType) {
            return this.postTask(taskType.id);
          }
        }
        return of();
      })
    )
  }

  private postTask(taskTypeId: string): Observable<Hatching> {
    const body = this.getTaskBody(taskTypeId);
    return this.taskService.postTask(body).pipe(
      switchMap(response => this.postEmergence(response))
    );
  }

  private getTaskBody(taskTypeId: string): PostTaskRequest {
    let newDate = new Date();
    return {
      nestingId: this.selectedNesting?.id || '', 
      taskTypeId: taskTypeId, 
      executionDateTime: newDate, 
      comment: this.selectedNesting?.title || 'error' + ' ' + this.datePipe.transform(newDate)
    }
  }


  private postEmergence(task: Task): Observable<any> {
    const body: PostEmergenceRequest = {
      nestingId: this.selectedNesting?.id || '', 
      taskId: task.id
    };
    return this.emergenceService.postEmergence(body);

  }

  onClose() {
    this.dialogRefParent.close(null);
  }

}
