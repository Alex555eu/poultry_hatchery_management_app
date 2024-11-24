import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { Task } from '../../../models/task.model';
import { CustomDateFormatterPipe } from '../../../utils/date-format/custom-date-formatter.pipe';
import { CommonModule } from '@angular/common';
import { Nesting } from '../../../models/nesting.model';
import { NestingService } from '../../../services/nesting/nesting.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CandlingService } from '../../../services/candling/candling.service';
import { PostCandlingRequest } from '../../../dto/post-candling-request';
import { Router } from '@angular/router';
import { TasksService } from '../../../services/tasks/tasks.service';
import { TaskTypeEntityNameValueForCandling } from '../../../app.config';
import { PostTaskRequest } from '../../../dto/post-task-request';
import { Candling } from '../../../models/candling.model';

@Component({
  selector: 'app-new-candling',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    CustomDateFormatterPipe,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    CustomDateFormatterPipe
  ],
  templateUrl: './new-candling.component.html',
  styleUrl: './new-candling.component.css'
})
export class NewCandlingComponent implements OnInit {

  nestings = new BehaviorSubject<Nesting[]|null>(null);

  selectedNesting: Nesting | null = null;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      task: Task
    },
    private dialogRefParent: MatDialogRef<NewCandlingComponent>,
    private nestingService: NestingService,
    private candlingService: CandlingService,
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
    }
  }


  onSubmit() {
    if (this.selectedNesting) {
      this.getTaskType().subscribe(response => {
        if (response) {
          this.router.navigate(['candling/open'], { queryParams: { id: response.id } });
        } 
        this.dialogRefParent.close(null);
      })
    }
  }

  
  getTaskType(): Observable<Candling> {
    return this.taskService.getAllTaskTypes().pipe(
      switchMap(response => {
        if (response) {
          const taskType = response.find(it => it.name === TaskTypeEntityNameValueForCandling) ||  null;
          if (taskType) {
            return this.postTask(taskType.id);
          }
        }
        return of();
      })
    )
  }


  postTask(taskTypeId: string): Observable<Candling> {
    const body = this.getTaskBody(taskTypeId);
    return this.taskService.postTask(body).pipe(
      switchMap(response => this.postCandling(response))
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

  
  postCandling(task: Task): Observable<Candling> {
    const body: PostCandlingRequest = {
      nestingId: this.selectedNesting?.id || '', 
      taskId: task.id
    };
    return this.candlingService.postCandling(body);
  }

  
  onClose() {
    this.dialogRefParent.close(null);
  }


}


