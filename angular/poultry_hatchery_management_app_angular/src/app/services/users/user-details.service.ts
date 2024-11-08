import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDetails } from '../../models/user-details.model';
import { TokenService } from '../token/token.service';
import { apiUrl } from '../../app.config';
import { AddressDetails } from '../../models/address-details.model';
import { OrganisationDetails } from '../../models/organisation-details.model';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { ApiPaths } from '../../api/api.paths';
import { RegisterSubUserRequest } from '../../dto/register-sub-user-request';


@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  private userDetails$: Observable<UserDetails> | null = null;
  private userDetailsAll$: Observable<UserDetails[]> | null = null;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService  
  ) { }

  public getUserDetails(forceReload: boolean = false): Observable<UserDetails>{
    if (!this.userDetails$ || forceReload){
      this.userDetails$ = this.http.get<any>(`${apiUrl}${ApiPaths.UserDataPaths.GET_USER_SELF}`).pipe(
        map(res => this.parseResponse(res)),
        shareReplay(1),
        catchError(error => {
          return of();
        })
      );
    }
    return this.userDetails$;
  }

  public getUserDetailsAll(forceReload: boolean = false): Observable<UserDetails[]> {
    if (!this.userDetailsAll$ || forceReload){
      this.userDetailsAll$ = this.http.get<any>(`${apiUrl}${ApiPaths.UserDataPaths.GET_OTHER_USERS}`).pipe(
        map(res => this.parseResponseList(res)),
        shareReplay(1),
        catchError(error => {
          return of();
        })
      );
    }
    return this.userDetailsAll$;
  }

  public postSubUser(body: RegisterSubUserRequest): Observable<any> {
    return this.http.post<any>(`${apiUrl}${ApiPaths.UserDataPaths.POST_USER}`, body);
  }

  private parseResponseList(jsonList: any[]): UserDetails[] {
    return jsonList.map(listItem => this.parseResponse(listItem));
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
      json.phoneNumber,
      json.role,
      json.isEnabled,
      organisation
    );
  }
}
