import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { NestingTrolleyService } from './../../services/nesting-trolley/nesting-trolley.service';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { UserDetailsService } from '../../services/users/user-details.service';
import { UserDetails } from '../../models/user-details.model';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { NestingIncubatorService } from '../../services/nesting-incubator/nesting-incubator.service';
import { NestingIncubator } from '../../models/nesting-incubator.model';
import { HatchingIncubatorService } from '../../services/hatching-incubator/hatching-incubator.service';
import { HatchingIncubator } from '../../models/hatching-incubator.model';
import { HatchingTrolley } from '../../models/hatching-trolley.model';
import { HatchingTrolleyService } from '../../services/hatching-trolley/hatching-trolley.service';
import { NestingTrolley } from '../../models/nesting-trolley.model';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewNestingTrolleyComponent } from './new-nesting-trolley/new-nesting-trolley.component';
import { NewNestingIncubatorComponent } from './new-nesting-incubator/new-nesting-incubator.component';
import { NewHatchingIncubatorComponent } from './new-hatching-incubator/new-hatching-incubator.component';
import { NewHatchingTrolleyComponent } from './new-hatching-trolley/new-hatching-trolley.component';
import { MatSelectModule } from '@angular/material/select';
import { OrganisationDetails } from '../../models/organisation-details.model';
import { EditOrganisationDetailsComponent } from './edit-organisation-details/edit-organisation-details.component';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    MatIcon,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    FormsModule,
    CommonModule,
    MatTabsModule,
    MatDialogModule
  ],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent {
  public adminFirstName: string = 'Imie';
  public adminLastName: string = 'Nazwisko';
  public adminRole: string = 'Rola';
  public adminEmail: string = 'Email';
  public phoneNumber: string = '000 000 000';
  public adminOrganisationName: string = "Organizacja";
  public adminOrganisationRegon: string = "";
  public adminOrganisationAddress: string = "";

  private organisationDetails: OrganisationDetails | null = null;

  public userDetailsAll: UserDetails[] | null = null;
  public filteredUserDetailsAll: UserDetails[] | null = null;
  public isUsersAccountEnabled: boolean | null = null;
  public selectedCategory: string = '';
  public searchText: string = '';

  public nestingIncubatorAll: NestingIncubator[] | null = null;
  public hatchingIncubatorAll: HatchingIncubator[] | null = null;
  public hatchingTrolleyAll: HatchingTrolley[] | null = null;
  public nestingTrolleyAll: NestingTrolley[] | null = null;

  public constructor (
    private userDetailsService: UserDetailsService,
    private nestingIncubatorService: NestingIncubatorService,
    private hatchingIncubatorService: HatchingIncubatorService,
    private hatchingTrolleyService: HatchingTrolleyService,
    private nestingTrolleyService: NestingTrolleyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    let adminDetails$ = this.userDetailsService.getUserDetails(); 
    adminDetails$.subscribe(adminDetails => {
      if (adminDetails) {
        this.adminFirstName = adminDetails.firstName;
        this.adminLastName = adminDetails.lastName;
        this.adminRole = adminDetails.role;
        this.adminEmail = adminDetails.emailAddress;
        this.phoneNumber = adminDetails.phoneNumber;
        this.adminOrganisationName = adminDetails.organisation.name;
        this.adminOrganisationRegon = adminDetails.organisation.regon;
        this.adminOrganisationAddress = `${adminDetails.organisation.address.postalCode}, 
                                        ${adminDetails.organisation.address.city}<br>
                                        ul. ${adminDetails.organisation.address.street} 
                                        ${adminDetails.organisation.address.number}`; 
        this.organisationDetails = adminDetails.organisation;
      }
    });
    let userDetailsAll$ = this.userDetailsService.getUserDetailsAll();
    userDetailsAll$.subscribe(userDetails => {
      this.userDetailsAll = userDetails;
      this.filteredUserDetailsAll = userDetails;
    });
    let nestingInsubator$ = this.nestingIncubatorService.getAllNestingIncubators();
    nestingInsubator$.subscribe((incubators) => {
      this.nestingIncubatorAll = incubators;
    });
    let hatchingIncubatorAll$ = this.hatchingIncubatorService.getAllHatchingIncubators();
    hatchingIncubatorAll$.subscribe(incubators => {
      this.hatchingIncubatorAll = incubators;
    })
    let hatchingTrolleyAll$ = this.hatchingTrolleyService.getAllHatchingTrolleys(true);
    hatchingTrolleyAll$.subscribe(trolleys => {
      this.hatchingTrolleyAll = trolleys;
    })
    let nestingTrolleyAll$ = this.nestingTrolleyService.getAllNestingTrolleys(true);
    nestingTrolleyAll$.subscribe(trolleys => {
      this.nestingTrolleyAll = trolleys;
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

  editOrganisationDetails() {
    let config = new MatDialogConfig();
    config.data = {
      organisationDetails: this.organisationDetails
    }
    const ref = this.dialog.open(EditOrganisationDetailsComponent, config);
    ref.afterClosed().subscribe(response => {
      if (response) {
        this.ngOnInit();
      }
    })
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

  newEmployee() {
    this.openDialog(NewEmployeeComponent)
  }

  newNestingIncubator() {
    this.openDialog(NewNestingIncubatorComponent)
  }

  newNestingTrolley() {
    this.openDialog(NewNestingTrolleyComponent)
  }

  newHatchingIncubator() {
    this.openDialog(NewHatchingIncubatorComponent)
  }

  newHatchingTrolley() {
    this.openDialog(NewHatchingTrolleyComponent)
  }

  private openDialog(component: any) {
    const config = new MatDialogConfig();
    config.width = '90vw';
    config.maxWidth = '600px';

    const dialogRef = this.dialog.open(component, config);
    dialogRef.afterClosed().subscribe(employee => {
      if (employee) {
        this.ngOnInit();
      }
    })
  } 

}
