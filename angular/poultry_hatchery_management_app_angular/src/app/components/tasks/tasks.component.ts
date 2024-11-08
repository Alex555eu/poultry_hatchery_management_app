import { CustomDateFormatterService } from './../../utils/date-format/custom-date-formatter.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TasksService } from '../../services/tasks/tasks.service';
import { Task } from '../../models/task.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TaskNestingTrolleyAssignment } from '../../models/task-nesting-trolley-assignment.model';
import { TaskStatus } from '../../models/task-status-enum';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TasksSectionComponent } from './tasks-section/tasks-section.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { NewTaskComponent } from './new-task/new-task.component';
import { FindTaskedTrolleysComponent } from './find-tasked-trolleys/find-tasked-trolleys.component';



@Component({
  selector: 'app-tasks',
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
    MatExpansionModule,
    MatProgressSpinnerModule,
    TasksSectionComponent,
    MatMenuModule,
    MatDialogModule
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {

  constructor (
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    
    public tasksService: TasksService,
    public dfs: CustomDateFormatterService
  ) {}

  TaskStatus = TaskStatus;

  expandedElement: Task | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['nesting', 'taskType', 'status', 'dueAt', 'progressBar'];
  dataSource = new MatTableDataSource<Task>();
  tasksAll: Task[] | null = null;

  startDate: Date | null = null;
  endDate: Date | null = null;

  private selectedTaskStatusDefaultValue = 'Wszystkie';
  statusTypes: string[] = [this.selectedTaskStatusDefaultValue].concat(Object.values(TaskStatus));
  selectedStatusValue: string = this.selectedTaskStatusDefaultValue;

  taskToTaskNestingTrolleyAssignmentMapping = new Map<Task, TaskNestingTrolleyAssignment[]>;

  todaysTasks: Task[] | null = null;
  yesterdaysTasks: Task[] | null = null;
  overdueTasks: Task[] | null = null;


  ngOnInit(): void {
      let allTasks$ = this.tasksService.getAllTasks();
      allTasks$.subscribe(tasks => {
        this.tasksAll = tasks;
        this.dataSource = new MatTableDataSource(tasks);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.todaysTasks = this.tasksService.filterTodaysTasks(tasks);
        this.yesterdaysTasks = this.tasksService.filterYesterdaysTasks(tasks);
        this.overdueTasks = this.tasksService.filterOverdueTasks(tasks);

        tasks.forEach(task => {
          this.tasksService.getAllTaskNestingTrolleyAssignmentsByTaskId(task.id).subscribe(assignments => {
            this.taskToTaskNestingTrolleyAssignmentMapping.set(task, assignments);
          });
        });
      });
  }

  onSecondaryBoardRowClick(selectedTaskId: string) {
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
    if (this.tasksAll){
      let filteredData: any | null = null;

      if (typeof event === 'string') {
        filteredData = this.tasksAll.filter(it => it.id === event); // 'event' is of type 'string', when requested with specific task ID

      } else {
        filteredData = this.tasksAll
        .filter(item => {
          if (event) {
            const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
            return item.taskType.name?.toString().toLowerCase().includes(filterValue) ||
                    item.id?.toString().toLowerCase().includes(filterValue) ||
                    item.taskType.description?.toString().toLowerCase().includes(filterValue) ||
                    item.executionScheduledAt?.toString().toLowerCase().includes(filterValue) ||
                    item.executionCompletedAt?.toString().toLowerCase().includes(filterValue) ||
                    item.taskStatus?.toString().toLowerCase().includes(filterValue) ||
                    item.nesting.title?.toString().toLowerCase().includes(filterValue);
          }
          return item;
        })
        .filter(item => {
          if (this.startDate) {
            return this.startDate <= new Date(item.executionScheduledAt);
          }
          return item;
        })
        .filter(item => {
          if (this.endDate) {
            return this.endDate >= new Date(item.executionScheduledAt);
          }
          return item;
        })
        .filter(item => {
          if (this.selectedStatusValue != this.selectedTaskStatusDefaultValue) {
            return item.taskStatus === this.selectedStatusValue;
          }
          return item;
        });
      };

      this.dataSource.data = filteredData; 
      this.dataSource.sort = this.sort;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  findTrolleys(assignments: TaskNestingTrolleyAssignment[] | null) {
    if (assignments) {
      const config = new MatDialogConfig();
      config.width = '90vw';
      config.maxWidth = '600px';

      config.data = {
        assignments: assignments
      };
      this.dialog.open(FindTaskedTrolleysComponent, config);
    }
  }

  cancelTask(task: Task) {
    let $task = this.tasksService.patchTaskStatus(task.id, TaskStatus.CANCELLED);
    $task.subscribe({
      next: (task: Task) => {
        window.location.reload();
      },
      error: (error: any) => {
        this.snackBar.open('Oops, coś poszło nie tak', 'Zamknij', {
          duration: 5000, // millis
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  reactivateTask(task: Task) {
    let $task = this.tasksService.patchTaskStatus(task.id, TaskStatus.NOT_STARTED);
    $task.subscribe({
      next: (task: Task) => {
        window.location.reload();
      },
      error: (error: any) => {
        this.snackBar.open('Oops, coś poszło nie tak', 'Zamknij', {
          duration: 5000, // millis
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  deleteTask(task: Task) {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      data: {
        title: "Uwaga",
        question: "Czy na pewno chcesz usunąć zadanie ?\nTa operacja jest NIEODWRACALNA.",
        positiveResponse: "Usuń zadanie",
        negativeResponse: "Wróć"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let $task = this.tasksService.deleteTask(task.id)
        $task.subscribe({
          next: () => {
            window.location.reload();
          },
          error: (error: any) => {
            this.snackBar.open('Oops, coś poszło nie tak', 'Zamknij', {
              duration: 5000, // millis
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        });
      }
    })
  };

  newTask() {
    this.dialog.open(NewTaskComponent);
  }

}
