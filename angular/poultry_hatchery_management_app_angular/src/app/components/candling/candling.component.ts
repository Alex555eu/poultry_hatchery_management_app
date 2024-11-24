import { Component, OnInit, ViewChild } from '@angular/core';
import { TasksSectionComponent } from "../tasks/tasks-section/tasks-section.component";
import { BehaviorSubject, from, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks/tasks.service';
import { Candling } from '../../models/candling.model';
import { TaskType } from '../../models/task-type.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { CustomDateFormatterPipe } from '../../utils/date-format/custom-date-formatter.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CandlingService } from '../../services/candling/candling.service';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { response } from 'express';
import { TaskNestingTrolleyAssignment } from '../../models/task-nesting-trolley-assignment.model';
import { TaskUtilsPipe } from '../../utils/task/task-utils.pipe';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { NewCandlingComponent } from './new-candling/new-candling.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-candling',
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
  templateUrl: './candling.component.html',
  styleUrl: './candling.component.css'
})
export class CandlingComponent implements OnInit {

  private candlingTaskTypeName = 'SWIETLENIE';

  todayCandlings: Task[] | null = null;
  selectedCandlingTask: string = '';

  taskToTaskNestingTrolleyAssignmentMapping = new Map<Task, TaskNestingTrolleyAssignment[]>;

  expandedElement: Candling | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['nesting', 'number', 'status', 'dueAt', 'progressBar'];
  dataSource = new MatTableDataSource<Candling>();
  candlingsAll: Candling[] | null = null;

  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(
    private taskService: TasksService,
    private candlingService: CandlingService,
    private dialog: MatDialog,
    private router: Router
  ){}

  ngOnInit(): void {
    this.initTasks(this.candlingTaskTypeName);
    this.initCandlings();
  }

  onSecondaryBoardRowClick(selectedTaskId: string) {
    this.selectedCandlingTask = selectedTaskId;
    this.filterData(selectedTaskId);
  }

  onDateRangeChange(event: MatDatepickerInputEvent<Date>, type: 'start' | 'end') {
    if (type === 'start') {
      this.startDate = event.value; 
    } else if (type === 'end') {
      this.endDate = event.value; 
    }
    this.filterData(null);
  }

  filterData(event: Event | null | string) {
    if (this.candlingsAll){
      let filteredData: any | null = null;

      if (typeof event === 'string' && event !== '') {
        filteredData = this.candlingsAll.filter(it => it.task.id === event); // 'event' is of type 'string', when requested with specific task ID

      } else {
        filteredData = this.candlingsAll
        .filter(item => {
          if (this.startDate) {
            return this.startDate <= new Date(item.createdAt);
          }
          return item;
        })
        .filter(item => {
          if (this.endDate) {
            return this.endDate >= new Date(item.createdAt);
          }
          return item;
        })
      };

      this.dataSource.data = filteredData; 
      this.dataSource.sort = this.sort;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }


  newNesting() {
    if (!this.selectedCandlingTask){
      let config = new MatDialogConfig();
      config.data = { 
        title: 'Uwaga',
        question: 'Nie wybrano zaplanowanego zadania. Czy chcesz rozpocząć nowe świetlenie poza harmonogramem ?',
        negativeResponse: 'Wróć',
        positiveResponse: 'Kontynuuj'
      }
      const dialogRef = this.dialog.open(ConfirmActionDialogComponent, config);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialog.open(NewCandlingComponent);
        }
      })
    } else {
      let config = new MatDialogConfig();
      const task = this.todayCandlings?.find(it => it.id === this.selectedCandlingTask);
      config.data = { 
        task: task,
      }
      this.dialog.open(NewCandlingComponent, config);
    }
  }

  goToCandling(element: Candling) {
    this.router.navigate(['candling/open'], { queryParams: { id: element.id } });
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

  private initCandlings() {
    this.candlingService.getAllCandlings().pipe(
      tap(response => {
        if (response) {
          this.candlingsAll = response;
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }),
      switchMap(response => this.initCandlingTaskDetails(response))
    ).subscribe();
  }

  private initCandlingTaskDetails(candlings: Candling[]): Observable<any> {
    return from(candlings).pipe(
      mergeMap(candling => {
        return this.taskService.getAllTaskNestingTrolleyAssignmentsByTaskId(candling.task.id).pipe(
          tap(response => {
            this.taskToTaskNestingTrolleyAssignmentMapping.set(candling.task, response);
          })
        )
      })
    );
  }

  private initTasks(type: string) {
    this.taskService.getAllActiveTasksByTaskTypeName(type)
    .subscribe(response => {
      if (response) {
        this.todayCandlings = response;
      }
    });
  }

  


}
