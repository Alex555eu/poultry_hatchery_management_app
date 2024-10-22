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
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

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
    FormsModule,
    CommonModule,
    MatTabsModule
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
  public isUsersAccountEnabled: boolean | null = null;
  public selectedCategory: string = '';
  public searchText: string = '';

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
      this.filteredUserDetailsAll = userDetails;
    })
  }

  filterItems() {
    if (this.userDetailsAll) {
      this.filteredUserDetailsAll = this.userDetailsAll.filter((userDetails) => {
      return userDetails.firstName.toLowerCase().match(this.searchText.toLowerCase()) ||
              userDetails.lastName.toLowerCase().match(this.searchText.toLowerCase()) ||
              userDetails.emailAddress.toLowerCase().match(this.searchText.toLowerCase());
      }).filter((userDetails) => {
        if (this.isUsersAccountEnabled != null) {
          return userDetails.isEnabled === this.isUsersAccountEnabled;
        } 
        return userDetails;
      });
    }
  }

  onCategoryChange(category: string) {
    switch(category) {
      case "enabled": {
        this.isUsersAccountEnabled = true;
        break;
      }
      case "disabled": {
        this.isUsersAccountEnabled = false;
        break;
      }
      default: {
        this.isUsersAccountEnabled = null;
      }
    }
    this.filterItems();
  }


}
