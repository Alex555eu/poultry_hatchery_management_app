import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FindSupplierComponent } from '../find-supplier/find-supplier.component';
import { Delivery } from '../../../models/delivery.model';
import { Supplier } from '../../../models/supplier.model';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { DeliveriesService } from '../../../services/deliveries/deliveries.service';
import { PostDeliveryRequest } from '../../../dto/post-delivery-request';

@Component({
  selector: 'app-create-delivery',
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
    MatStepperModule,
    MatSelectModule,
    FindSupplierComponent
  ],
  templateUrl: './create-delivery.component.html',
  styleUrl: './create-delivery.component.css'
})
export class CreateDeliveryComponent implements OnInit {

  @Output() closePanelEvent = new EventEmitter<Delivery|null>();

  isFindSupplierPopupComponentEnabled: boolean = false;
  selectedSupplier: Supplier | null = null;

  providerForm: FormGroup;

  productTypes: string[] | null = null;
  selectedProductType: string | null = null;

  constructor(
    private deliveriesService: DeliveriesService,
    private fb: FormBuilder
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
    if (this.providerForm.valid && this.selectedSupplier) {
      const request = this.makeRegisterRequestBody(this.providerForm, this.selectedSupplier.id);
      this.deliveriesService.postDelivery(request).subscribe(delivery => {
        this.closeCreateDeliveryPopupComponent(delivery);
      });
    }
  }

  createDeliveryPopupComponent() {
    this.isFindSupplierPopupComponentEnabled = true;
  }
  
  closeCreateDeliveryPopupComponent(delivery: Delivery | null) {
    this.closePanelEvent.emit(delivery);
  } 

  findSupplierPopupComponent() {
    this.isFindSupplierPopupComponentEnabled = true;
  }

  closeFindSupplierPopupComponent(supplier: Supplier | null) {
    this.selectedSupplier = supplier;
    this.isFindSupplierPopupComponentEnabled = false;
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
