import { NestingTrolleyService } from './../../services/nesting-trolley/nesting-trolley.service';
import { Component, ViewChild } from '@angular/core';
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
import { NestingIncubatorService } from '../../services/nesting-incubator/nesting-incubator.service';
import { NestingIncubator } from '../../models/nesting-incubator.model';
import { HatchingIncubatorService } from '../../services/hatching-incubator/hatching-incubator.service';
import { HatchingIncubator } from '../../models/hatching-incubator.model';
import { HatchingTrolley } from '../../models/hatching-trolley.model';
import { HatchingTrolleyService } from '../../services/hatching-trolley/hatching-trolley.service';
import { NestingTrolley } from '../../models/nesting-trolley.model';
import { CreateNestingIncubatorPanelComponent } from '../popup-panels/create-nesting-incubator-panel/create-nesting-incubator-panel.component';
import { CreateHatchingIncubatorPanelComponent } from '../popup-panels/create-hatching-incubator-panel/create-hatching-incubator-panel/create-hatching-incubator-panel.component';
import { CreateNestingTrolleyComponent } from '../popup-panels/create-nesting-trolley/create-nesting-trolley/create-nesting-trolley.component';

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
    MatTabsModule,
    CreateNestingIncubatorPanelComponent,
    CreateHatchingIncubatorPanelComponent,
    CreateNestingTrolleyComponent
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

  public nestingIncubatorAll: NestingIncubator[] | null = null;
  public hatchingIncubatorAll: HatchingIncubator[] | null = null;
  public hatchingTrolleyAll: HatchingTrolley[] | null = null;
  public nestingTrolleyAll: NestingTrolley[] | null = null;

  public isNestingIncubatorPanelComponentEnabled: boolean = false;
  //public nestingIncubatorPanelComponentData: NestingIncubator | null = null;

  public isHatchingIncubatorPanelComponentEnabled: boolean = false;
  public isNestingTrolleyPanelComponentEnabled: boolean = false;

  public constructor (
    private userDetailsService: UserDetailsService,
    private nestingIncubatorService: NestingIncubatorService,
    private hatchingIncubatorService: HatchingIncubatorService,
    private hatchingTrolleyService: HatchingTrolleyService,
    private nestingTrolleyService: NestingTrolleyService
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
    });
    let nestingInsubator$ = this.nestingIncubatorService.getAllNestingIncubators();
    nestingInsubator$.subscribe((incubators) => {
      this.nestingIncubatorAll = incubators;
    });
    let hatchingIncubatorAll$ = this.hatchingIncubatorService.getAllHatchingIncubators();
    hatchingIncubatorAll$.subscribe(incubators => {
      this.hatchingIncubatorAll = incubators;
    })
    let hatchingTrolleyAll$ = this.hatchingTrolleyService.getAllHatchingTrolleys();
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

  // modifyNestingIncubator(incubatorId: string) { 
  //   if (this.nestingIncubatorAll) {
  //     const data = this.nestingIncubatorAll.find((incubator) => {
  //       return incubator.id === incubatorId;
  //     });
  //     if (data) {
  //       this.nestingIncubatorPanelComponentData = data;
  //       this.isNestingIncubatorPanelComponentEnabled = true;
  //     }
  //   }
  // }

  createNestingIncubator() {
    //this.nestingIncubatorPanelComponentData = null;
    this.isNestingIncubatorPanelComponentEnabled = true;
  }

  closeNestingIncubatorPanelComponent() {
    this.isNestingIncubatorPanelComponentEnabled = false;
    this.ngOnInit();
  }

  createHatchingIncubator() {
    this.isHatchingIncubatorPanelComponentEnabled = true;
  }

  closeHatchingIncubatorPanelComponent() {
    this.isHatchingIncubatorPanelComponentEnabled = false;
    this.ngOnInit();
  }

  createNestingTrolley() {
    this.isNestingTrolleyPanelComponentEnabled = true;
  }

  closeNestingTrolleyPanelComponent() {
    this.isNestingTrolleyPanelComponentEnabled = false;
    this.ngOnInit();
  }

}
