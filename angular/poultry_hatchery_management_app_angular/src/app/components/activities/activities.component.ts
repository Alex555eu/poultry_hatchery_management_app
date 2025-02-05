import { Component, OnInit } from '@angular/core';
import { TasksSectionComponent } from '../tasks/tasks-section/tasks-section.component';
import { TasksService } from '../../services/tasks/tasks.service';
import { CandlingService } from '../../services/candling/candling.service';
import { HatchingService } from '../../services/hatching/hatching.service';
import { EmergenceService } from '../../services/emergence/emergence.service';
import { Task } from '../../models/task.model';
import { Observable, tap } from 'rxjs';
import { TaskTypeEntityNameValueForCandling, TaskTypeEntityNameValueForEmergence, TaskTypeEntityNameValueForHatching } from '../../app.config';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [
    TasksSectionComponent
  ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css'
})
export class ActivitiesComponent implements OnInit {

  candlingTasks: Task[] = [];
  hatchingTasks: Task[] = [];
  emergenceTasks: Task[] = [];

  constructor(
    private tasksService: TasksService,
    private candlingService: CandlingService,
    private hatchingService: HatchingService,
    private emergenceService: EmergenceService,
    private router: Router,
    private snackBar: MatSnackBar
  ){}


  ngOnInit(): void {
      this.initCandlingTasks().subscribe();
      this.initHatchingTasks().subscribe();
      this.initEmergenceTasks().subscribe();
  }


  selectedCandlingTask(taskId: string) {
    this.candlingService.getCandlingByTaskId(taskId).subscribe(response => {
      if (response) {
        this.router.navigate(['candling/open'], { queryParams: { id: response.id } });
      } else {
        this.displayError();
      }
    });
  }
  
  selectedHathchingTask(taskId: string) {
    this.hatchingService.getHatchingByTaskId(taskId).subscribe(response => {
      if (response) {
        this.router.navigate(['hatching/open'], { queryParams: { id: response.id } });
      } else {
        this.displayError();
      }
    });
  }
  
  selectedEmergenceTask(taskId: string) {
    this.emergenceService.getEmergenceByTaskId(taskId).subscribe(response => {
      if (response) {
        this.router.navigate(['emergence/open'], { queryParams: { id: response.id } });
      } else {
        this.displayError();
      }
    });
  }

  private displayError() {
    this.snackBar.open('Aktywność nadal nie utworzona. Skontaktuj się z przełożonym', 'Zamknij', {
      duration: 5000, // millis
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  private initCandlingTasks(): Observable<any> {
    return this.tasksService.getAllActiveTasksByTaskTypeName(TaskTypeEntityNameValueForCandling).pipe(
      tap(response => {
        if (response) {
          this.candlingTasks = response;
        }
      })
    );
  }
 
  private initHatchingTasks(): Observable<any> {
    return this.tasksService.getAllActiveTasksByTaskTypeName(TaskTypeEntityNameValueForHatching).pipe(
      tap(response => {
        if (response) {
          this.hatchingTasks = response;
        }
      })
    )
  }

  private initEmergenceTasks(): Observable<any> {
    return this.tasksService.getAllActiveTasksByTaskTypeName(TaskTypeEntityNameValueForEmergence).pipe(
      tap(response => {
        if (response) {
          this.emergenceTasks = response;
        }
      })
    )
  }


}
