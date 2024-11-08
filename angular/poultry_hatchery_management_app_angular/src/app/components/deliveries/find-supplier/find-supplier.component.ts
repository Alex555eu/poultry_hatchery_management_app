import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { Supplier } from '../../../models/supplier.model';
import { SupplierService } from '../../../services/supplier/supplier.service';
import { RegisterSupplierComponent } from '../register-supplier/register-supplier.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

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
    RegisterSupplierComponent,
    MatDialogModule
  ],
  templateUrl: './find-supplier.component.html',
  styleUrl: './find-supplier.component.css'
})
export class FindSupplierComponent implements OnInit, AfterViewInit {

  private suppliers: Supplier[] | null = null;
  filteredSuppliers: Supplier[] | null = null;

  searchText: string = '';

  constructor(
    private supplierService: SupplierService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private dialogRefParent: MatDialogRef<FindSupplierComponent>,
    private snackBar: MatSnackBar
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

  registerSupplier() {
    const dialogRefChild = this.dialog.open(RegisterSupplierComponent);
    dialogRefChild.afterClosed().subscribe(supplier => {
      if (supplier){
        this.dialogRefParent.close(supplier);
      }
    })
  }

  selectSupplier(supplier: Supplier) {
    this.dialogRefParent.close(supplier);
  }

  onClose() {
    this.dialogRefParent.close(null);
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

}
