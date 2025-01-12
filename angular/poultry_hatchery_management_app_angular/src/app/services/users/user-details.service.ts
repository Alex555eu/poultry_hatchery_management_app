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
import { PutOrganistionDetailsRequest } from '../../dto/put-organisation-details-request';


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

  public patchUser(userId: string, isEnabled: boolean): Observable<any> {
    const body = {userId: userId, isEnabled: isEnabled};
    return this.http.patch<any>(`${apiUrl + ApiPaths.UserDataPaths.PATCH_USER}`, body).pipe(
      catchError(error => {
        return of();
      })
    );
  }

  public putUser(body: {userId: string, firstName: string, lastName: string, phoneNumber: string}): Observable<UserDetails> {
    return this.http.put<UserDetails>(`${apiUrl + ApiPaths.UserDataPaths.PUT_USER}`, body).pipe(
      catchError(error => {
        return of();
      })
    );
  }

  public postNewPassword(body: {oldPassword: string, newPassword: string}): Observable<UserDetails> {
    return this.http.post<UserDetails>(`${apiUrl + ApiPaths.UserDataPaths.POST_NEW_PASSWORD}`, body).pipe(
      catchError(error => {
        return of();
      })
    );
  }

  public putOrganisationDetails(body: PutOrganistionDetailsRequest): Observable<OrganisationDetails> {
    return this.http.put<OrganisationDetails>(`${apiUrl + ApiPaths.UserDataPaths.PUT_ORGANISATION }`, body).pipe(
      catchError(error => {
        return of();
      })
    );
  }

}
