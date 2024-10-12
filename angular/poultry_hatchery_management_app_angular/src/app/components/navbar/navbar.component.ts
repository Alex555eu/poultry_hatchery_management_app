import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card'

import { RouterOutlet } from '@angular/router';
import { UserDetails } from '../../models/user-details.model';
import { UserDetailsService } from '../../services/users/user-details.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterOutlet,
    MatCardModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  public userFirstName: string = 'Imie';
  public userLastName: string = 'Nazwisko';
  public userRole: string = 'Rola';

  private userDetailsService: UserDetailsService;

  public constructor(userDetailsService: UserDetailsService) 
  {
    this.userDetailsService = userDetailsService;
  }

  ngOnInit() {
    let userDetails$: Observable<UserDetails> = this.userDetailsService.getUserDetails(); 
    userDetails$.subscribe(userDetails => {
      if (userDetails) {
        this.userFirstName = userDetails.firstName;
        this.userLastName = userDetails.lastName;
        this.userRole = userDetails.role;
      }
    });
  }


}
