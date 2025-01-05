import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HatchingService } from '../../../services/hatching/hatching.service';
import { Task } from '../../../models/task.model';
import { TasksService } from '../../../services/tasks/tasks.service';
import { Router } from '@angular/router';
import { CustomDateFormatterPipe } from '../../../utils/date-format/custom-date-formatter.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { Nesting } from '../../../models/nesting.model';
import { NestingService } from '../../../services/nesting/nesting.service';
import { Hatching } from '../../../models/hatching.model';
import { TaskTypeEntityNameValueForHatching } from '../../../app.config';
import { PostTaskRequest } from '../../../dto/post-task-request';
import { PostHatchingRequest } from '../../../dto/post-hatching-request';

@Component({
  selector: 'app-new-hatching',
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
  templateUrl: './new-hatching.component.html',
  styleUrl: './new-hatching.component.css'
})
export class NewHatchingComponent implements OnInit {

  nestings = new BehaviorSubject<Nesting[]|null>(null);

  selectedNesting: Nesting | null = null;

  constructor(
    private dialogRefParent: MatDialogRef<NewHatchingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      task: Task
    },
    private hatchingService: HatchingService,
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
      this.getTaskType().subscribe(response => {
        if (response) {
          this.router.navigate(['hatching/open'], { queryParams: { id: response.id } });
        } 
        this.dialogRefParent.close(null);
      })
    }
  }

  
  getTaskType(): Observable<Hatching> {
    return this.taskService.getAllTaskTypes().pipe(
      switchMap(response => {
        if (response) {
          const taskType = response.find(it => it.name === TaskTypeEntityNameValueForHatching) || null;
          if (taskType) {
            return this.postTask(taskType.id);
          }
        }
        return of();
      })
    )
  }


  postTask(taskTypeId: string): Observable<Hatching> {
    const body = this.getTaskBody(taskTypeId);
    return this.taskService.postTask(body).pipe(
      switchMap(response => this.postHatching(response))
    );
  }


  getTaskBody(taskTypeId: string): PostTaskRequest {
    let newDate = new Date();
    return {
      nestingId: this.selectedNesting?.id || '', 
      taskTypeId: taskTypeId, 
      executionDateTime: newDate, 
      comment: this.selectedNesting?.title || 'error' + ' ' + this.datePipe.transform(newDate)
    }
  }

  
  postHatching(task: Task): Observable<any> {
    const body: PostHatchingRequest = {
      nestingId: this.selectedNesting?.id || '', 
      taskId: task.id
    };
    return this.hatchingService.postHatching(body);
  }

  
  onClose() {
    this.dialogRefParent.close(null);
  }


}
