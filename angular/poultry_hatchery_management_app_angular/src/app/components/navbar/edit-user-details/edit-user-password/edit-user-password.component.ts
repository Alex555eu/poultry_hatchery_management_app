import { UserDetailsService } from './../../../../services/users/user-details.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-user-password',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './edit-user-password.component.html',
  styleUrl: './edit-user-password.component.css'
})
export class EditUserPasswordComponent {

  password: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private dialogRef: MatDialogRef<EditUserPasswordComponent>,
    private userDetailsService: UserDetailsService,
    private snackBar: MatSnackBar
  ){}


  onSubmit() {
    if (this.password && this.newPassword === this.confirmPassword) {
      this.userDetailsService.postNewPassword({
        oldPassword: this.password,
        newPassword: this.confirmPassword
      }).subscribe(response => {
        if(response) {
          this.dialogRef.close(response);
        } else {
          this.snackBar.open('Nieprawidłowe dane', 'Zamknij', {
            duration: 5000, // millis
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      })
    }
  }

}
