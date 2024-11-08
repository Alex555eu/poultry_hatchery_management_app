import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SupplierService } from '../../../services/supplier/supplier.service';
import { PostSupplierRequest } from '../../../dto/post-supplier-request';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register-supplier',
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
    MatStepperModule,
    MatExpansionModule,
    MatDialogModule
  ],
  templateUrl: './register-supplier.component.html',
  styleUrl: './register-supplier.component.css'
})
export class RegisterSupplierComponent {

  providerForm: FormGroup;

  constructor(
    private supplierService: SupplierService,
    private fb: FormBuilder,
    private dialogRefParent: MatDialogRef<RegisterSupplierComponent>
  ) {
    this.providerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      wni: ['', [Validators.required]],
      address: this.fb.group({
        city: ['', Validators.required],
        postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{2}-[0-9]{3}$')]],
        street: ['', Validators.required],
        number: ['', Validators.required]
      })
    });
  }

  onSubmit() {
    if (this.providerForm.valid) {
      this.supplierService.postSupplier(this.makeRegisterRequestBody(this.providerForm)).subscribe(supplier => {
        this.dialogRefParent.close(supplier);
      });
    }
  }

  onClose() {
    this.dialogRefParent.close(null);
  }

  private makeRegisterRequestBody(form: FormGroup): PostSupplierRequest {
    let registerRequest: PostSupplierRequest = {
        firstName: form.get('firstName')?.value,
        lastName: form.get('lastName')?.value,
        city: form.get('address.city')?.value,
        number: form.get('address.number')?.value,
        postalCode: form.get('address.postalCode')?.value,
        street: form.get('address.street')?.value,
        wni: form.get('wni')?.value,
      };
    return registerRequest;
  }

}
