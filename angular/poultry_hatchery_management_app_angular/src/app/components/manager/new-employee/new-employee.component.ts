import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { UserDetailsService } from '../../../services/users/user-details.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RegisterSubUserRequest } from '../../../dto/register-sub-user-request';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { UserDetails } from '../../../models/user-details.model';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-employee',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './new-employee.component.html',
  styleUrl: './new-employee.component.css'
})
export class NewEmployeeComponent {
  dataForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userDetailsservice: UserDetailsService,
    private snackBar: MatSnackBar,
    private dialogRefParent: MatDialogRef<NewEmployeeComponent>
  ) {
    this.dataForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      emailAddress: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required],  
    }, { validators: this.matchValidator('password', 'repeatPassword') });
  }


  onSubmit() {
    if (this.dataForm.valid) {
      let body: RegisterSubUserRequest = {
        firstName: this.dataForm.get('firstName')?.value,
        lastName: this.dataForm.get('lastName')?.value,
        phoneNumber: this.dataForm.get('phoneNumber')?.value,
        emailAddress: this.dataForm.get('emailAddress')?.value,
        password: this.dataForm.get('password')?.value,
      }
      this.userDetailsservice.postSubUser(body).subscribe({
        next: (response) => {
          this.onClose(response);
        },
        error: (error: any) => {
          this.snackBar.open('Coś poszło nie tak', 'Zamknij', {
            duration: 5000, // millis
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  onClose(employee: UserDetails | null) {
    this.dialogRefParent.close(employee);
  }


  private matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
        const control = abstractControl.get(controlName);
        const matchingControl = abstractControl.get(matchingControlName);
        if (matchingControl!.errors && !matchingControl!.errors?.['confirmedValidator']) {
            return null;
        }
        if (control!.value !== matchingControl!.value) {
          const error = { confirmedValidator: 'Passwords do not match.' };
          matchingControl!.setErrors(error);
          return error;
        } else {
          matchingControl!.setErrors(null);
          return null;
        }
    }
  }
}
