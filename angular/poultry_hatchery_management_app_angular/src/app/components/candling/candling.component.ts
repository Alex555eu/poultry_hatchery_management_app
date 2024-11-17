import { Component, OnInit, ViewChild } from '@angular/core';
import { TasksSectionComponent } from "../tasks/tasks-section/tasks-section.component";
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
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
import { MatDialogModule } from '@angular/material/dialog';

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
    CustomDateFormatterPipe
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

  expandedElement: Candling | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['nesting', 'dueAt', 'number'];
  dataSource = new MatTableDataSource<Candling>();
  candlingsAll: Candling[] | null = null;

  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(
    private taskService: TasksService,
    private candlingService: CandlingService
  ){}

  
  ngOnInit(): void {
    this.initTasks();
    this.initCandlings();
    
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
    if (this.candlingsAll){
      let filteredData: any | null = null;

      if (typeof event === 'string') {
        filteredData = this.candlingsAll.filter(it => {
          let task: Task | null = this.todayCandlings?.find(task => task.id === event) || null;
          if (task) {
            return it.nesting.id === task.nesting.id &&
            it.scheduledAt.getFullYear === task.executionScheduledAt.getFullYear &&
            it.scheduledAt.getMonth === task.executionScheduledAt.getMonth &&
            it.scheduledAt.getDay === task.executionScheduledAt.getDay;
          } 
          return it;
        }); // 'event' is of type 'string', when requested with specific task ID

      } else {
        filteredData = this.candlingsAll
        .filter(item => {
          if (this.startDate) {
            return this.startDate <= new Date(item.scheduledAt);
          }
          return item;
        })
        .filter(item => {
          if (this.endDate) {
            return this.endDate >= new Date(item.scheduledAt);
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

  }

  deleteCandling(element: Candling) {

  }



  private initCandlings() {
    this.candlingService.getAllCandlings().subscribe(response => {
      if (response) {
        this.candlingsAll = response;
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  private initTasks() {
    this.getCandlingTaskType().subscribe();
  }

  private getCandlingTaskType(): Observable<any> {
    return this.taskService.getAllTaskTypes().pipe(
      switchMap(response => {
        const taskType = response.find(type => type.name === this.candlingTaskTypeName) || null;
        return this.getAllActiveTasksByCandlingTaskType(taskType);
      })
    );
  }

  private getAllActiveTasksByCandlingTaskType(types: TaskType | null): Observable<any> {
    if (types) {
      return this.taskService.getAllActiveTasksByTaskTypeId(types.id).pipe(
        tap(response => {
          if (response) {
            this.todayCandlings = response;
          }
        })
      );
    }
    return of();
  }


}
