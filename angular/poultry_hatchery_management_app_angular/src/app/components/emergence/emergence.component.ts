import { Component, ViewChild } from '@angular/core';
import { TaskTypeEntityNameValueForEmergence } from '../../app.config';
import { Task } from '../../models/task.model';
import { Emergence } from '../../models/emergence.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CustomDateFormatterPipe } from '../../utils/date-format/custom-date-formatter.pipe';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TasksSectionComponent } from '../tasks/tasks-section/tasks-section.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TasksService } from '../../services/tasks/tasks.service';
import { Router } from '@angular/router';
import { EmergenceService } from '../../services/emergence/emergence.service';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { NewEmergenceComponent } from './new-emergence/new-emergence.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RaportService } from '../../services/raport/raport.service';

@Component({
  selector: 'app-emergence',
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
  templateUrl: './emergence.component.html',
  styleUrl: './emergence.component.css'
})
export class EmergenceComponent {

  private emergenceTaskTypeName = TaskTypeEntityNameValueForEmergence; // config
  
  todayEmergences: Task[] | null = null;
  selectedTask: string = '';

  expandedElement: Emergence | null = null;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['emergence', 'status', 'dueAt'];
  dataSource = new MatTableDataSource<Emergence>();
  emergencesAll: Emergence[] | null = null;
  
  constructor(
    private taskService: TasksService,
    private emergenceService: EmergenceService,
    private dialog: MatDialog,
    private router: Router,
    private raportService: RaportService
  ){}

  ngOnInit(): void {
    this.initTasks(this.emergenceTaskTypeName);
    this.initEmergences();
  }
  
  
  getStatusColor(status: string) {
    return this.taskService.getStatusColor(status);
  }
  translateStatusEnToPl(status: string) {
    return this.taskService.translateStatusEnToPl(status);
  }

  newEmergence() {
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
          this.dialog.open(NewEmergenceComponent);
        }
      })
    } else {
      let config = new MatDialogConfig();
      const task = this.todayEmergences?.find(it => it.id === this.selectedTask);
      config.data = { 
        task: task,
      }
      this.dialog.open(NewEmergenceComponent, config);
    }
  }

  goToEmergence(element: Emergence) {
    this.router.navigate(['emergence/open'], { queryParams: { id: element.id } });
  }

  generateRaport(element: Emergence) {
    this.raportService.downloadExcel(element);
  }


  onSecondaryBoardRowClick(selectedTaskId: string) {
    this.selectedTask = selectedTaskId;
    this.filterData(selectedTaskId);
  }

  filterData(event: Event | null | string) {
    if (this.emergencesAll){
      let filteredData: any | null = null;

      if (typeof event === 'string') {
        if (event !== ''){
          filteredData = this.emergencesAll.filter(it => it.task.id === event); // 'event' is of type 'string', when requested with specific task ID
        } else {
          filteredData = this.emergencesAll;
        }
      } 
      this.dataSource.data = filteredData; 
      this.dataSource.sort = this.sort;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
     }
  }  


  private initTasks(type: string) {
    this.taskService.getAllActiveTasksByTaskTypeName(type)
    .subscribe(response => {
      if (response) {
        this.todayEmergences = response;
      }
    });
  }

  private initEmergences() {
    this.emergenceService.getAllEmergences().subscribe(
      response => {
        if (response) {
          this.emergencesAll = response;
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
    )
  }


}
