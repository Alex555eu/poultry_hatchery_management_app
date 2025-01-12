import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OrganisationDetails } from '../../../models/organisation-details.model';
import { UserDetailsService } from '../../../services/users/user-details.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-organisation-details',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './edit-organisation-details.component.html',
  styleUrl: './edit-organisation-details.component.css'
})
export class EditOrganisationDetailsComponent implements OnInit {

  orgDetails: OrganisationDetails | null = null;

  constructor(
    private dialogRef: MatDialogRef<EditOrganisationDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      organisationDetails: OrganisationDetails
    },
    private uds: UserDetailsService
  ){}

  ngOnInit(): void {
    if (this.data) {
      this.orgDetails = this.data.organisationDetails;
    }
  }

  saveData() {
    if (this.orgDetails){
      this.uds.putOrganisationDetails({
        name: this.orgDetails.name,
        city: this.orgDetails.address.city,
        postalCode: this.orgDetails.address.postalCode,
        street: this.orgDetails.address.street,
        number: this.orgDetails.address.number
      }).subscribe(response => {
        if (response) {
          this.dialogRef.close(response);
        }
      });
    }
  }

}
