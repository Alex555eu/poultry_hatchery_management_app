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

import {ChangeDetectionStrategy, signal} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { FindSupplierComponent } from '../popup-panels/find-supplier/find-supplier.component';
import { Supplier } from '../../models/supplier.model';
import { CreateDeliveryComponent } from '../popup-panels/create-delivery/create-delivery.component';

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
    CreateDeliveryComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './deliveries.component.html',
  styleUrl: './deliveries.component.css'
})
export class DeliveriesComponent implements OnInit {

  constructor (
    private deliveriesService: DeliveriesService
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

  isFindSupplierPopupComponentEnabled: boolean = false;
  selectedSupplier: Supplier | null = null;

  isCreateDeliveryPopupComponentEnabled: boolean = false;


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

  applyFilterFromInput(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRowClicked(row: Delivery) {
    //todo: implementation (modify delivery)
  }

  createDeliveryPopupComponent() {
    this.isCreateDeliveryPopupComponentEnabled = true;
  }

  closeCreateDeliveryPopupComponent(delivery: Delivery | null) {
    this.isCreateDeliveryPopupComponentEnabled = false;
  }

  findSupplierPopupComponent() {
    this.isFindSupplierPopupComponentEnabled = true;
  }
  
  closeFindSupplierPopupComponent(event: Supplier | null) {
    if (event) {
      this.selectedSupplier = event;
    }
    this.isFindSupplierPopupComponentEnabled = false;
    this.filterData();
  }

  cancelSupplierSelection() {
    this.selectedSupplier = null;
    this.filterData();
  }

  onDateRangeChange(event: MatDatepickerInputEvent<Date>, type: 'start' | 'end') {
    if (type === 'start') {
      this.startDate = event.value; 
    } else if (type === 'end') {
      this.endDate = event.value; 
    }
    this.filterData();
  }

  filterData() {
    if (this.deliveriesAll){
      const filteredData = this.deliveriesAll
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
