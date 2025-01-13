import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, share, shareReplay, switchMap } from 'rxjs';
import { Task } from '../../models/task.model';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { TaskNestingTrolleyAssignment } from '../../models/task-nesting-trolley-assignment.model';
import { TaskStatus } from '../../models/task-status-enum';
import { PutTaskRequest } from '../../dto/put-task-request';
import { TaskType } from '../../models/task-type.model';
import { PostTaskRequest } from '../../dto/post-task-request';
import { TaskSchedule } from '../../models/task-schedule.model';
import { TaskScheduleDetails } from '../../models/task-schedule-details.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private allTasks: Observable<Task[]> | null = null;
  private taskAssignmentsCache: Map<string, Observable<TaskNestingTrolleyAssignment[]>> = new Map();

  constructor(
    private http: HttpClient
  ) {}

  getAllTasks(forceReload: boolean = false): Observable<Task[]> {
    if (!this.allTasks || forceReload){
      this.allTasks = this.http.get<Task[]>(`${apiUrl}${ApiPaths.TaskPaths.GET_ALL_TASKS}`).pipe(
        shareReplay(1),
        catchError(error => {
          return of([]);
        })
      );
    }
    return this.allTasks;
  }

  getAllActiveTasksByIncubatorId(incubatorId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${apiUrl + ApiPaths.TaskPaths.GET_ALL_ACTIVE_TASKS_BY_INCUBATOR_ID + incubatorId}`).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    )
  }

  getAllActiveTasksByTaskTypeName(taskTypeName: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${apiUrl + ApiPaths.TaskPaths.GET_ALL_ACTIVE_TASKS_BY_TASK_TYPE_NAME + taskTypeName}`).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    )
  }

  getAllActiveTasksByTrolleyId(trolleyId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${apiUrl + ApiPaths.TaskPaths.GET_ALL_ACTIVE_TASKS_BY_TROLLEY_ID + trolleyId}`).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    )
  }

  getAllTaskNestingTrolleyAssignmentsByTaskId(taskId: string): Observable<TaskNestingTrolleyAssignment[]> {
    if (this.taskAssignmentsCache.has(taskId)) {
        return this.taskAssignmentsCache.get(taskId)!;
    }
    const taskAssignments$ = this.http.get<TaskNestingTrolleyAssignment[]>(`${apiUrl}${ApiPaths.TaskPaths.GET_ALL_TASK_ASSIGNED_TROLLEYS_BY_TASK_ID}${taskId}`).pipe(
        shareReplay(1),
        catchError(error => {
            console.error('Error fetching task assignments', error);
            return of([]); 
        })
    );
    this.taskAssignmentsCache.set(taskId, taskAssignments$);

    return taskAssignments$;
  }

  postTask(body: PostTaskRequest): Observable<Task> {
    return this.http.post<Task>(`${apiUrl + ApiPaths.TaskPaths.POST_TASK}`, body).pipe(
      catchError(error => {
        console.error(error);
        return of(); 
      })
    )
  }
 
  putTaskProgressOnTrolley(body: PutTaskRequest): Observable<Task> {
    return this.http.put<any>(`${apiUrl + ApiPaths.TaskPaths.PUT_TASK}`, body).pipe(
      catchError(error => {
        console.error(error);
        return of(); 
      })
    )
  }

  deleteTask(taskId: string): any {
    return this.http.delete(`${apiUrl}${ApiPaths.TaskPaths.DELETE_TASK}${taskId}`).pipe(
      catchError(error => {
        console.error('Error deleting task', error);
        return of(); 
    })
    );
  }

  patchTaskStatus(taskId: string, taskStatus: TaskStatus): Observable<Task> {
    const body = {taskId: taskId, taskStatus: taskStatus};
    return this.http.patch<Task>(`${apiUrl}${ApiPaths.TaskPaths.PATCH_TASK_STATUS}`, body).pipe(
      shareReplay(1),
      catchError(error => {
        console.error('Error patching task status', error);
        return of(); 
      })
    );
  }

  getAllTaskTypes(): Observable<TaskType[]> {
    return this.http.get<TaskType[]>(`${apiUrl}${ApiPaths.TaskPaths.GET_ALL_TASK_TYPES}`).pipe(
      shareReplay(1),
      catchError(error => {
        console.error('Error patching task type', error);
        return of([]); 
      })
    );
  }


  getAllTaskSchedules(): Observable<TaskSchedule[]> {
    return this.http.get<TaskSchedule[]>(`${apiUrl}${ApiPaths.TaskPaths.GET_ALL_TASK_SCHEDULES}`).pipe(
      catchError(error => {
        console.error(error);
        return of([]); 
      })
    );
  }

  postTaskSchedule(title: string): Observable<TaskSchedule> {
    const body = {title: title};
    return this.http.post<TaskSchedule>(`${apiUrl}${ApiPaths.TaskPaths.GET_ALL_TASK_SCHEDULES}`, body).pipe(
      catchError(error => {
        console.error(error);
        return of(); 
      })
    );
  }

  deleteTaskSchedule(taskScheduleId: string): Observable<any> {
    return this.http.delete<any>(`${apiUrl}${ApiPaths.TaskPaths.DELETE_TASK_SCHEDULE}`).pipe(
      catchError(error => {
        console.error(error);
        return of(); 
      })
    );
  }

  getAllTaskScheduleDetails(taskScheduleId: string): Observable<TaskScheduleDetails[]> {
    return this.http.get<TaskScheduleDetails[]>(`${apiUrl}${ApiPaths.TaskPaths.GET_TASK_SCHEDULE_DETAILS + taskScheduleId}`).pipe(
      catchError(error => {
        console.error(error);
        return of([]); 
      })
    );
  }

  postTaskScheduleDetail(taskScheduleId: string, taskTypeId: string, taskExecutionOrderNumber: number, daysOffsetFromPrevTask: number): Observable<TaskScheduleDetails> {
    const body = {taskScheduleId: taskScheduleId, taskTypeId: taskTypeId, taskExecutionOrderNumber: taskExecutionOrderNumber, daysOffsetFromPrevTask: daysOffsetFromPrevTask};
    return this.http.post<TaskScheduleDetails>(`${apiUrl}${ApiPaths.TaskPaths.POST_TASK_SCHEDULE_DETAIL}`, body).pipe(
      catchError(error => {
        console.error(error);
        return of(); 
      })
    );
  }

  postTaskBySchedule(nestingId: string, taskScheduleId: string, beginFrom: Date): Observable<any> {
    const body = {nestingId: nestingId, taskScheduleId: taskScheduleId, beginFrom: beginFrom};
    return this.http.post<any>(`${apiUrl}${ApiPaths.TaskPaths.POST_TASK_BY_SCHEDULE}`, body).pipe(
      catchError(error => {
        console.error(error);
        return of(); 
      })
    );
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////
  filterTodaysTasks(tasks: Task[]): Task[] {
    const today = new Date();
    const todaysTasks = tasks.filter(task => {
      const taskDate = new Date(task.executionScheduledAt);
      return (
        taskDate.getFullYear() === today.getFullYear() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getDate() === today.getDate()
      );
    });
    return todaysTasks;
  }

  filterYesterdaysTasks(tasks: Task[]): Task[] {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const yesterdaysTasks = tasks.filter(task => {
      const taskDate = new Date(task.executionScheduledAt);
      return (
        taskDate.getFullYear() === yesterday.getFullYear() &&
        taskDate.getMonth() === yesterday.getMonth() &&
        taskDate.getDate() === yesterday.getDate()
      );
    });
    return yesterdaysTasks;
  }

  filterOverdueTasks(tasks: Task[]): Task[] {
    const today = new Date();
    const overdueTasks = tasks.filter(task => {
      const taskDate = new Date(task.executionScheduledAt);
      return (
        taskDate <= today &&
        task.taskStatus !== TaskStatus.COMPLETED && 
        task.taskStatus !== TaskStatus.CANCELLED
    );
    });
    return overdueTasks;
  }

  getStatusColor(status: string): string {
    switch(status) {
      case TaskStatus.NOT_STARTED: {
        return 'gray';
      }
      case TaskStatus.IN_PROGRESS: {
        return '#bae1ff';
      }
      case TaskStatus.COMPLETED: {
        return '#44fd6cc5';
      }
      case TaskStatus.CANCELLED: {
        return '#ffb3ba';
      }
      default: {
        return 'white';
      }
    }
  }

  translateStatusEnToPl(status: string): string {
    switch(status) {
      case TaskStatus.NOT_STARTED: {
        return 'Nierozpoczęte';
      }
      case TaskStatus.IN_PROGRESS: {
        return 'W trakcie';
      }
      case TaskStatus.COMPLETED: {
        return 'Zakończone';
      }
      case TaskStatus.CANCELLED: {
        return 'Anulowane';
      }
      default: {
        return '';
      }
    }
  }
  
  getTaskCompletionPercentage(assignments: TaskNestingTrolleyAssignment[] | null): number {
    if (assignments){
      const countTrolleys = assignments.length;
      const countTaskCompletedTrolleys = assignments.filter(item => item.isTaskCompleted).length;

      return Math.floor((countTaskCompletedTrolleys * 100) / countTrolleys);
    }
    return 0;
  }

  getNumberOfCompletedTaskTrolleyAssignments(assignments: TaskNestingTrolleyAssignment[] | null): number {
    if (assignments){
      return assignments.filter(it => it.isTaskCompleted).length;
    }
    return -1;
  }

}
