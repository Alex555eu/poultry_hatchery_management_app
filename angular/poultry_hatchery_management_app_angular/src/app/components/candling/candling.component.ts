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
import { MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-candling',
  standalone: true,
  imports: [
    TasksSectionComponent,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    CustomDateFormatterPipe,
    MatMenuModule,
    MatButtonModule
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
    private taskService: TasksService
  ){}

  

  ngOnInit(): void {
    this.getCandlingTaskType().subscribe();

    
  }

  newNesting() {

  }

  deleteCandling(element: Candling) {

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
