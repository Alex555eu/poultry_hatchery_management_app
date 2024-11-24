import { Component, OnInit, ViewChild } from '@angular/core';
import { TasksSectionComponent } from "../tasks/tasks-section/tasks-section.component";
import { mergeMap, Observable, of, switchMap, tap, map, from, filter } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { CustomDateFormatterPipe } from '../../utils/date-format/custom-date-formatter.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Nesting } from '../../models/nesting.model';
import { NestingService } from '../../services/nesting/nesting.service';
import { RejectionService } from '../../services/rejections/rejection.service';
import { NestingLoadedDeliveriesService } from '../../services/nesting-loaded-deliveries/nesting-loaded-deliveries.service';
import { FindSupplierComponent } from '../deliveries/find-supplier/find-supplier.component';
import { Supplier } from '../../models/supplier.model';
import { Router } from '@angular/router';
import { NestingLoadedDeliveries } from '../../models/nesting-loaded-deliveries.model';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-nesting',
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
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    CustomDateFormatterPipe
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './nesting.component.html',
  styleUrl: './nesting.component.css'
})
export class NestingComponent implements OnInit {

  expandedElement: Nesting | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['title', 'status', 'dateTime'];
  dataSource = new MatTableDataSource<Nesting>();
  nestingsAll: Nesting[] | null = null;

  nestingLoadedDeliveries = new Map<Nesting, NestingLoadedDeliveries[]>();

  searchForUnfinishedNestingsOnly: boolean = true;

  selectedSupplier: Supplier | null = null;

  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(
    private nestingService: NestingService,
    private nldService: NestingLoadedDeliveriesService,
    private dialog: MatDialog,
    private router: Router
  ){}

  ngOnInit(): void {
    this.nestingService.getAllNestings().pipe(
      tap(response => {
        if (response) {
          this.nestingsAll = response;
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }),
      switchMap(nestings => {
        return from(nestings).pipe(
          mergeMap(nesting => {
            return this.nldService.getAllNestingLoadedDeliveriesByNestingId(nesting.id).pipe(
              tap(response => {
                if (response) {
                  if (this.nestingLoadedDeliveries.has(nesting)) {
                    this.nestingLoadedDeliveries.set(nesting, this.nestingLoadedDeliveries.get(nesting)?.concat(response) ?? [])
                  } else {
                    this.nestingLoadedDeliveries.set(nesting, response);
                  }
                }
              })
            )
          })
        )
      })
    ).subscribe();
  }

  newNesting() {
    // add dialog
  }

  goToNesting(nesting: Nesting) {
    this.router.navigate(['nesting/open'], { queryParams: { id: nesting.id } });
  }


  filterData(event: Event | null) {
    if (this.nestingsAll){
      const filteredData = this.nestingsAll
      .filter(item => {
        if (event) {
          const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
          return item.title.toString().toLowerCase().includes(filterValue) ||
                  item.dateTime.toString().toLowerCase().includes(filterValue) ||
                  item.id.toLowerCase().includes(filterValue) ||
                  item.description.toString().toLowerCase().includes(filterValue) ||
                  this.nestingLoadedDeliveries.get(item)?.map(it => it.delivery.supplier.name.toLowerCase()).some(word => word.includes(filterValue)) ||
                  this.nestingLoadedDeliveries.get(item)?.map(it => it.delivery.supplier.surname.toLowerCase()).some(word => word.includes(filterValue)) ||
                  this.nestingLoadedDeliveries.get(item)?.map(it => it.delivery.supplier.address.city.toLowerCase()).some(word => word.includes(filterValue)) ||
                  this.nestingLoadedDeliveries.get(item)?.map(it => it.delivery.supplier.address.street.toLowerCase()).some(word => word.includes(filterValue)) ||
                  this.nestingLoadedDeliveries.get(item)?.map(it => it.delivery.supplier.address.postalCode.toLowerCase()).some(word => word.includes(filterValue)) ||
                  this.nestingLoadedDeliveries.get(item)?.map(it => it.delivery.productType.name.toLowerCase()).some(word => word.includes(filterValue)) ||
                  item.isFinished

        }
        return item;
      })
      .filter(item => {
        if (this.startDate) {
          return this.startDate <= new Date(item.dateTime);
        }
        return item;
      })
      .filter(item => {
        if (this.endDate) {
          return this.endDate >= new Date(item.dateTime);
        }
        return item;
      })
      .filter(item => {
        if (this.searchForUnfinishedNestingsOnly) {
          return item.isFinished === false;
        }
        return item;
      })
      .filter(item => {
        if (this.selectedSupplier) {
          return this.nestingLoadedDeliveries.get(item)?.map(it => it.delivery.supplier.id).includes(this.selectedSupplier.id);
        }
        return item;
      });
      this.dataSource.data = filteredData; 
      this.dataSource.sort = this.sort;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  onDateRangeChange(event: MatDatepickerInputEvent<Date>, type: 'start' | 'end') {
    if (type === 'start') {
      this.startDate = event.value; 
    } else if (type === 'end') {
      this.endDate = event.value; 
    }
    this.filterData(null);
  }

  findSupplier() {
    const dialogRef = this.dialog.open(FindSupplierComponent);
    dialogRef.afterClosed().subscribe(supplier => {
      if (supplier) {
        this.selectedSupplier = supplier;
        this.filterData(null);
      }
    })
  }

  discardSupplier() {
    this.selectedSupplier = null;
    this.filterData(null);
  }


}
