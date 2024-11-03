import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { Supplier } from '../../../models/supplier.model';
import { SupplierService } from '../../../services/supplier/supplier.service';
import { RegisterSupplierComponent } from '../register-supplier/register-supplier.component';

@Component({
  selector: 'app-find-supplier',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatExpansionModule,
    RegisterSupplierComponent
  ],
  templateUrl: './find-supplier.component.html',
  styleUrl: './find-supplier.component.css'
})
export class FindSupplierComponent implements OnInit, AfterViewInit {

  @Output() closePanelEvent = new EventEmitter<Supplier | null>();

  isRegisterSupplierComponentEnabled: boolean = false;

  private suppliers: Supplier[] | null = null;
  filteredSuppliers: Supplier[] | null = null;

  searchText: string = '';
  chosenSupplier: Supplier | null = null;

  constructor(
    private supplierService: SupplierService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let supplierResponse$ = this.supplierService.getAllSuppliers(true);
    supplierResponse$.subscribe(supp => {
      this.suppliers = supp;
      this.filteredSuppliers = supp;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  registerNewSupplier() {
    this.isRegisterSupplierComponentEnabled = true;
  }

  closeRegisterNewSupplier(supplier: Supplier | null) {
    this.isRegisterSupplierComponentEnabled = false;
    if (supplier) {
      return this.selectSupplier(supplier);
    }
    return this.onClose();
  }

  selectSupplier(supplier: Supplier) {
    this.chosenSupplier = supplier;
    this.onClose();
  }

  filterItems() {
    if (this.suppliers) {
      this.filteredSuppliers = this.suppliers.filter((details) => {
        return details.name.toLowerCase().match(this.searchText.toLowerCase()) ||
          details.surname.toLowerCase().match(this.searchText.toLowerCase()) ||
          details.wni.toLowerCase().match(this.searchText.toLowerCase()) ||
          details.address.city.toLowerCase().match(this.searchText.toLowerCase()) ||
          details.address.street.toLowerCase().match(this.searchText.toLowerCase()) ||
          details.address.postalCode.toLowerCase().match(this.searchText.toLowerCase()) ||
          details.address.number.toLowerCase().match(this.searchText.toLowerCase());
      });
    }
  }

  getFirstStringLetter(str: string): string {
    return str.charAt(0);
  }

  onClose() {
    this.closePanelEvent.emit(this.chosenSupplier);
  }

}
