import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DeliveriesService } from '../../services/deliveries/deliveries.service';
import { Delivery } from '../../models/delivery.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChangeDetectionStrategy } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { FindSupplierComponent } from './find-supplier/find-supplier.component';
import { Supplier } from '../../models/supplier.model';
import { NewDeliveryComponent } from './new-delivery/new-delivery.component';

@Component({
  selector: 'app-deliveries',
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
    FindSupplierComponent,
    MatDialogModule,
    NewDeliveryComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './deliveries.component.html',
  styleUrl: './deliveries.component.css'
})
export class DeliveriesComponent implements OnInit {

  constructor (
    private deliveriesService: DeliveriesService,
    private dialog: MatDialog
  ) {}

  private selectedProductDefaultValue: string = 'Wszystkie';
  productTypes: string[] = [this.selectedProductDefaultValue];
  selectedProductType: string = this.selectedProductDefaultValue;

  startDate: Date | null = null;
  endDate: Date | null = null;

  displayedColumns: string[] = ['supplier', 'productType', 'quantity', 'dateTime'];
  deliveriesAll: Delivery[] | null = null;
  dataSource = new MatTableDataSource<Delivery>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedSupplier: Supplier | null = null;


  ngOnInit() {
    let allDeliveries$ = this.deliveriesService.getAllDeliveries();
    allDeliveries$.subscribe(details => {
      this.deliveriesAll = details;
      this.dataSource = new MatTableDataSource(details);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    let allProductTypes$ = this.deliveriesService.getAllProductTypes();
    allProductTypes$.subscribe(types => {
      this.productTypes = types;
      this.productTypes.push(this.selectedProductDefaultValue);
    })
  }

  onRowClicked(row: Delivery) {
    //todo: implementation (modify delivery)
  }

  newDelivery() {
    this.dialog.open(NewDeliveryComponent);
  }

  // createDeliveryPopupComponent() {
  //   this.isCreateDeliveryPopupComponentEnabled = true;
  // }

  // closeCreateDeliveryPopupComponent(delivery: Delivery | null) {
  //   this.isCreateDeliveryPopupComponentEnabled = false;
  //   window.location.reload();
  // }

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

  onDateRangeChange(event: MatDatepickerInputEvent<Date>, type: 'start' | 'end') {
    if (type === 'start') {
      this.startDate = event.value; 
    } else if (type === 'end') {
      this.endDate = event.value; 
    }
    this.filterData(null);
  }

  filterData(event: Event | null) {
    if (this.deliveriesAll){
      const filteredData = this.deliveriesAll
      .filter(item => {
        if (event) {
          const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
          return item.quantity.toString().toLowerCase().includes(filterValue) ||
                  item.dateTime.toString().toLowerCase().includes(filterValue) ||
                  item.productType.name.toString().toLowerCase().includes(filterValue) ||
                  item.supplier.name.toString().toLowerCase().includes(filterValue) ||
                  item.supplier.surname.toString().toLowerCase().includes(filterValue) ||
                  item.supplier.wni.toString().toLowerCase().includes(filterValue) ||
                  item.supplier.address.city.toString().toLowerCase().includes(filterValue) ||
                  item.supplier.address.number.toString().toLowerCase().includes(filterValue) ||
                  item.supplier.address.postalCode.toString().toLowerCase().includes(filterValue) ||
                  item.supplier.address.street.toString().toLowerCase().includes(filterValue);
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
        if (this.selectedProductType != this.selectedProductDefaultValue) {
          return item.productType.name === this.selectedProductType;
        }
        return item;
      })
      .filter(item => {
        if (this.selectedSupplier) {
          return this.selectedSupplier.id === item.supplier.id;
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

  getFirstStringLetter(str: string): string {
    return str.charAt(0);
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    return new Date(date).toLocaleString("pl-PL", options);
  }

}
