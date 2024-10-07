import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from '../../services/cookie.service';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegisterService } from '../../services/register.service';
import { AuthResponse } from '../../models/auth-response.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterRequest } from '../../models/register-request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatError,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
    private registerService: RegisterService,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      orgCity: [''],
      orgPostalCode: ['', [Validators.required, Validators.pattern('\\d{2}-\\d{3}')]],
      orgStreet: [''],
      orgNumber: [''],
      orgName: [''],
      orgRegon: [''],
      emailAddress: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required],  
    }, { validators: this.matchValidator('password', 'repeatPassword') });
  }
  


  onSubmit(): void {
    if (this.registerForm.valid) {
      this.registerService.register(this.makeRegisterRequestBody(this.registerForm)).subscribe({
        next: (data: AuthResponse) => {
          this.cookieService.set(data.token, data.refreshToken);
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          this.snackBar.open('Nieprawidłowe dane rejestracji', 'Zamknij', {
            duration: 5000, // millis
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      })

    }
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

  private makeRegisterRequestBody(form: FormGroup): RegisterRequest {
    let registerRequest: RegisterRequest = {
    emailAddress: form.get('emailAddress')?.value,
    firstName: form.get('firstName')?.value,
    lastName: form.get('firstName')?.value,
    orgCity: form.get('orgCity')?.value,
    orgName: form.get('orgName')?.value,
    orgNumber: form.get('orgNumber')?.value,
    orgPostalCode: form.get('orgPostalCode')?.value,
    orgRegon: form.get('orgRegon')?.value,
    orgStreet: form.get('orgStreet')?.value,
    password: form.get('password')?.value,
    };
    return registerRequest;
  }

}
