import { Component } from '@angular/core';
import { Supplier } from '../../../models/supplier.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeliveriesService } from '../../../services/deliveries/deliveries.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PostDeliveryRequest } from '../../../dto/post-delivery-request';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { FindSupplierComponent } from '../find-supplier/find-supplier.component';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-new-delivery',
  standalone: true,
  imports: [
    MatIconModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    CommonModule,
    MatOptionModule,
    MatInputModule,
    FindSupplierComponent,
    MatButtonModule,
    MatSelectModule,
    MatExpansionModule
  ],
  templateUrl: './new-delivery.component.html',
  styleUrl: './new-delivery.component.css'
})
export class NewDeliveryComponent {

  selectedSupplier: Supplier | null = null;

  providerForm: FormGroup;

  productTypes: string[] | null = null;
  selectedProductType: string | null = null;

  private isCurrentlySubmitting: boolean = false;

  constructor(
    private deliveriesService: DeliveriesService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRefParent: MatDialogRef<NewDeliveryComponent>
  ) {
    this.providerForm = this.fb.group({
      productType: ['', Validators.required],
      quantity: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    let allProductTypes$ = this.deliveriesService.getAllProductTypes();
    allProductTypes$.subscribe(types => {
      this.productTypes = types;
    })
  }

  onSubmit() {
    if (this.providerForm.valid && this.selectedSupplier && !this.isCurrentlySubmitting) {
      this.isCurrentlySubmitting = true;
      const request = this.makeRegisterRequestBody(this.providerForm, this.selectedSupplier.id);
      this.deliveriesService.postDelivery(request).subscribe(delivery => {
        this.dialogRefParent.close(delivery);
      });
    }
  }

  onClose() {
    this.dialogRefParent.close(null);
  }

  findSupplier() {
    const dialogRefChild = this.dialog.open(FindSupplierComponent);
    dialogRefChild.afterClosed().subscribe(supplier => {
      if (supplier) {
        this.selectedSupplier = supplier;
      }
    })
  }

  private makeRegisterRequestBody(form: FormGroup, supplierId: string): PostDeliveryRequest {
    let registerRequest: PostDeliveryRequest = {
        productType: form.get('productType')?.value,
        quantity: form.get('quantity')?.value,
        supplierId: supplierId
      };
    return registerRequest;
  }
}
