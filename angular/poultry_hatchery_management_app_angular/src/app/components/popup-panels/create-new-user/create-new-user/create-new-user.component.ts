import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserDetailsService } from '../../../../services/users/user-details.service';
import { RegisterSubUserRequest } from '../../../../dto/register-sub-user-request';

@Component({
  selector: 'app-create-new-user',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './create-new-user.component.html',
  styleUrl: './create-new-user.component.css'
})
export class CreateNewUserComponent {

  @Output()
  closePanelEvent = new EventEmitter();

  dataForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userDetailsservice: UserDetailsService,
    private snackBar: MatSnackBar
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
          this.onClose();
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

  onClose() {
    this.closePanelEvent.emit();
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
