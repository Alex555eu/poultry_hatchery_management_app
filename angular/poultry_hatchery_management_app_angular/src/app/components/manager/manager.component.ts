import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { UserDetailsService } from '../../services/users/user-details.service';
import { UserDetails } from '../../models/user-details.model';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    MatCard,
    MatIcon,
    MatButtonModule,
    MatExpansionModule
  ],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent {
  public userFirstName: string = 'Imie';
  public userLastName: string = 'Nazwisko';
  public userRole: string = 'Rola';
  public userEmail: string = 'Email';
  public userOrganisationName: string = "Organizacja";
  public userOrganisationRegon: string = "";
  public userOrganisationAddress: string = "";

  private userDetails$: Observable<UserDetails> | null = null;

  public constructor (
    private userDetailsService: UserDetailsService
  ) {}

  ngOnInit() {
    this.userDetails$ = this.userDetailsService.getUserDetails(); 
    this.userDetails$.subscribe(userDetails => {
      if (userDetails) {
        this.userFirstName = userDetails.firstName;
        this.userLastName = userDetails.lastName;
        this.userRole = userDetails.role;
        this.userEmail = userDetails.emailAddress;
        this.userOrganisationName = userDetails.organisation.name;
        this.userOrganisationRegon = userDetails.organisation.regon;
        this.userOrganisationAddress = `${userDetails.organisation.address.postalCode}, 
                                        ${userDetails.organisation.address.city}<br>
                                        ul. ${userDetails.organisation.address.street} 
                                        ${userDetails.organisation.address.number}`;
        
        
      }
    });
  }


}
