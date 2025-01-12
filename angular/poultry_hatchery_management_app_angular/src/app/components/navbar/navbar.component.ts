import { config } from './../../app.config.server';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card'
import { Router, RouterModule } from '@angular/router';
import { UserDetails } from '../../models/user-details.model';
import { UserDetailsService } from '../../services/users/user-details.service';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { TokenService } from '../../services/token/token.service';
import { AuthService } from '../../services/authorization/auth.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { EditUserDetailsComponent } from './edit-user-details/edit-user-details.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterModule,
    MatCardModule,
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  public userFirstName: string = 'Imie';
  public userLastName: string = 'Nazwisko';
  public userRole: string = 'Rola';

  private userDetails: UserDetails | null = null;


  public constructor(
    private userDetailsService: UserDetailsService,
    private tokenService: TokenService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) 
  {}

  ngOnInit() {
    let userDetails$: Observable<UserDetails> = this.userDetailsService.getUserDetails(); 
    userDetails$.subscribe(userDetails => {
      if (userDetails) {
        this.userFirstName = userDetails.firstName;
        this.userLastName = userDetails.lastName;
        this.userRole = userDetails.role;

        this.userDetails = userDetails;
      }
    });
  }

  editPersonalInfo() {
    let config = new MatDialogConfig();
    config.data = {
      userDetails: this.userDetails
    }
    const ref = this.dialog.open(EditUserDetailsComponent, config);
    ref.afterClosed().subscribe(response => {
      if (response) {
        this.ngOnInit();
      }
    })
  }

  logout() {
    const authToken = this.tokenService.getAuthToken();
    if (!authToken) {
      this.router.navigate(['login']);
      window.location.reload();
      return of();
    }
    return this.authService.logout(authToken).pipe(
      tap(() => {
        this.tokenService.clearAll();
        this.router.navigate(['login']);
        window.location.reload();
      }),
      catchError(err => {
        this.tokenService.clearAll();
        this.router.navigate(['login']);
        window.location.reload();
        return throwError(() => err);
      })
    ).subscribe();
  }


}
