import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { UserDetailsService } from '../../services/users/user-details.service';
import { UserDetails } from '../../models/user-details.model';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    MatCard,
    MatIcon,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    FormsModule
  ],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent {
  public adminFirstName: string = 'Imie';
  public adminLastName: string = 'Nazwisko';
  public adminRole: string = 'Rola';
  public adminEmail: string = 'Email';
  public adminOrganisationName: string = "Organizacja";
  public adminOrganisationRegon: string = "";
  public adminOrganisationAddress: string = "";

  public userDetailsAll: UserDetails[] | null = null;
  public filteredUserDetailsAll: UserDetails[] | null = null;
  public userCategory: string = '';

  public constructor (
    private userDetailsService: UserDetailsService
  ) {}

  ngOnInit() {
    let adminDetails$ = this.userDetailsService.getUserDetails(); 
    adminDetails$.subscribe(adminDetails => {
      if (adminDetails) {
        this.adminFirstName = adminDetails.firstName;
        this.adminLastName = adminDetails.lastName;
        this.adminRole = adminDetails.role;
        this.adminEmail = adminDetails.emailAddress;
        this.adminOrganisationName = adminDetails.organisation.name;
        this.adminOrganisationRegon = adminDetails.organisation.regon;
        this.adminOrganisationAddress = `${adminDetails.organisation.address.postalCode}, 
                                        ${adminDetails.organisation.address.city}<br>
                                        ul. ${adminDetails.organisation.address.street} 
                                        ${adminDetails.organisation.address.number}`;
         
      }
    });
    let userDetailsAll$ = this.userDetailsService.getUserDetailsAll();
    userDetailsAll$.subscribe(userDetails => {
      this.userDetailsAll = userDetails;
    })
  }

  filterItems() {

  }

  onCategoryChange(event: any) {

  }



}
