import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskTypeEntityNameValueForHatching } from '../../app.config';
import { Task } from '../../models/task.model';
import { TasksSectionComponent } from '../tasks/tasks-section/tasks-section.component';
import { Hatching } from '../../models/hatching.model';
import { TasksService } from '../../services/tasks/tasks.service';
import { RejectionService } from '../../services/rejections/rejection.service';
import { NestingLoadedDeliveriesService } from '../../services/nesting-loaded-deliveries/nesting-loaded-deliveries.service';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { HatchingService } from '../../services/hatching/hatching.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { CustomDateFormatterPipe } from '../../utils/date-format/custom-date-formatter.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskNestingTrolleyAssignment } from '../../models/task-nesting-trolley-assignment.model';
import { from, mergeMap, Observable, tap } from 'rxjs';
import { Rejection3 } from '../../models/rejection3.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NewHatchingComponent } from './new-hatching/new-hatching.component';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';

@Component({
  selector: 'app-hatching',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    TasksSectionComponent,
    MatMenuModule,
    MatDialogModule,
    CustomDateFormatterPipe,
    MatProgressSpinnerModule
  ],
    animations: [
      trigger('detailExpand', [
        state('collapsed,void', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ],
  templateUrl: './hatching.component.html',
  styleUrl: './hatching.component.css'
})
export class HatchingComponent implements OnInit {

  private candlingTaskTypeName = TaskTypeEntityNameValueForHatching; // config

  todayHatchings: Task[] | null = null;
  selectedTask: string = '';

  expandedElement: Hatching | null = null;

  taskToTaskNestingTrolleyAssignmentMapping = new Map<Task, TaskNestingTrolleyAssignment[]>;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['nesting', 'status', 'dueAt', 'progressBar'];
  dataSource = new MatTableDataSource<Hatching>();
  hatchingsAll: Hatching[] | null = null;

  hatchingRejections = new Map<Hatching, Rejection3[]>();

  constructor(
    private taskService: TasksService,
    private hatchingService: HatchingService,
    private rejectionService: RejectionService,
    private nldService: NestingLoadedDeliveriesService,
    private dialog: MatDialog,
    private router: Router
  ){}

  ngOnInit(): void {
    this.initTasks(this.candlingTaskTypeName);
    this.initHatchings();
  }


  onSecondaryBoardRowClick(selectedTaskId: string) {
    this.selectedTask = selectedTaskId;
    this.filterData(selectedTaskId);
  }


  filterData(event: Event | null | string) {
    if (this.hatchingsAll){
      let filteredData: any | null = null;

      if (typeof event === 'string') {
        if (event !== ''){
          filteredData = this.hatchingsAll.filter(it => it.task.id === event); // 'event' is of type 'string', when requested with specific task ID
        } else {
          filteredData = this.hatchingsAll;
        }
      } 
      this.dataSource.data = filteredData; 
      this.dataSource.sort = this.sort;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
     }
  }

  newHatching() {
    if (!this.selectedTask){
      let config = new MatDialogConfig();
      config.data = { 
        title: 'Uwaga',
        question: 'Nie wybrano zaplanowanego zadania. Czy chcesz rozpocząć nowy przekład poza harmonogramem ?',
        negativeResponse: 'Wróć',
        positiveResponse: 'Kontynuuj'
      }
      const dialogRef = this.dialog.open(ConfirmActionDialogComponent, config);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialog.open(NewHatchingComponent);
        }
      })
    } else {
      let config = new MatDialogConfig();
      const task = this.todayHatchings?.find(it => it.id === this.selectedTask);
      config.data = { 
        task: task,
      }
      this.dialog.open(NewHatchingComponent, config);
    }
  }

  goToCandling(element: Hatching) {
    this.router.navigate(['hatching/open'], { queryParams: { id: element.id } });
  }
  getStatusColor(status: string) {
    return this.taskService.getStatusColor(status);
  }
  translateStatusEnToPl(status: string) {
    return this.taskService.translateStatusEnToPl(status);
  }
  getTaskCompletionPercentage(assignments: TaskNestingTrolleyAssignment[] | null) {
    return this.taskService.getTaskCompletionPercentage(assignments);
  }
  getNumberOfCompletedTaskTrolleyAssignments(assignments: TaskNestingTrolleyAssignment[] | null) {
    return this.taskService.getNumberOfCompletedTaskTrolleyAssignments(assignments);
  }
  getHatchingRejectionsTotal(hatching: Hatching) {
    return this.hatchingRejections.get(hatching)?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  }


  private initTasks(type: string) {
    this.taskService.getAllActiveTasksByTaskTypeName(type)
    .subscribe(response => {
      if (response) {
        this.todayHatchings = response;
      }
    });
  }

  private initHatchings() {
    this.hatchingService.getAllHatchings().subscribe(
      response => {
        if (response) {
          this.hatchingsAll = response;
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.initTaskDetails(response).subscribe();
          this.initHatchingRejections(response).subscribe();
        }
      }
    )
  }

  private initTaskDetails(hatchings: Hatching[]): Observable<any> {
    return from(hatchings).pipe(
      mergeMap(hatching => {
        return this.taskService.getAllTaskNestingTrolleyAssignmentsByTaskId(hatching.task.id).pipe(
          tap(response => {
            this.taskToTaskNestingTrolleyAssignmentMapping.set(hatching.task, response);
          })
        )
      })
    );
  }

    private initHatchingRejections(hatchings: Hatching[]): Observable<any> {
      return from(hatchings).pipe(
        mergeMap(hatching => {
          return this.rejectionService.getAllRejection3ByHatching(hatching.id).pipe(
            tap(response => {
              if (response) {
                if (this.hatchingRejections.has(hatching)) {
                  this.hatchingRejections.set(hatching, this.hatchingRejections.get(hatching)?.concat(response) ?? []);
                } else {
                  this.hatchingRejections.set(hatching, response);
                }
              }
            })
          )
        })
      )
    }

}
