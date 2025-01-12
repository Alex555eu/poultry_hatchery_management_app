import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserDetails } from '../../../models/user-details.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UserDetailsService } from '../../../services/users/user-details.service';

@Component({
  selector: 'app-edit-user-details',
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
  templateUrl: './edit-user-details.component.html',
  styleUrl: './edit-user-details.component.css'
})
export class EditUserDetailsComponent implements OnInit {

  userDetails: UserDetails | null = null;

  constructor(
    private dialogRef: MatDialogRef<EditUserDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      userDetails: UserDetails
    },
    private userDetailsService: UserDetailsService
  ){}

ngOnInit(): void {
  if(this.data) {
    this.userDetails = this.data.userDetails;
  }    
}

saveData() {
  if (this.userDetails) {
    this.userDetailsService.putUser({
      userId: this.userDetails.id,
      firstName: this.userDetails.firstName,
      lastName: this.userDetails.lastName,
      phoneNumber: this.userDetails.phoneNumber
    }).subscribe(response => {
      if (response) {
        this.dialogRef.close(response);
      }
    });
  }
}

changePassword() {
  // open new dialog
}

}
