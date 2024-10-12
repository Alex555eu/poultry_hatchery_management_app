import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDetails } from '../../models/user-details.model';
import { TokenService } from '../token/token.service';
import { apiUrl } from '../../app.config';
import { AddressDetails } from '../../models/address-details.model';
import { OrganisationDetails } from '../../models/organisation-details.model';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  private userDetails$: Observable<UserDetails> | null = null;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  public getUserDetails(): Observable<UserDetails>{
    if (!this.userDetails$){
      const token = this.tokenService.getAuthToken();
      const header = token ? new HttpHeaders({ 'Authorization' : token }) : new HttpHeaders();
      this.userDetails$ = this.http.get<any>(`${apiUrl}/api/v1/data/user/self`, { headers : header }).pipe(
        map(res => this.parseResponse(res)),
        shareReplay(1),
        catchError(error => {
          return of();
        })
      );
    }
    return this.userDetails$;
  }

  private parseResponse(json: any): UserDetails {
    const address = new AddressDetails(
      json.organisation.address.id,
      json.organisation.address.city,
      json.organisation.address.postalCode,
      json.organisation.address.street,
      json.organisation.address.number
    );
    const organisation = new OrganisationDetails(
      json.organisation.id,
      json.organisation.name,
      json.organisation.regon,
      address
    );
    return new UserDetails(
      json.id,
      json.firstName,
      json.lastName,
      json.emailAddress,
      json.role,
      organisation
    );
  }
}
