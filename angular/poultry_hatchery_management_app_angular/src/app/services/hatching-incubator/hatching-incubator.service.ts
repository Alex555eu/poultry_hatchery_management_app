import { Injectable } from '@angular/core';
import { HatchingIncubator } from '../../models/hatching-incubator.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { AddressDetails } from '../../models/address-details.model';
import { OrganisationDetails } from '../../models/organisation-details.model';
import { PostIncubatorRequest } from '../../dto/post-incubator-request';

@Injectable({
  providedIn: 'root'
})
export class HatchingIncubatorService {

  constructor(
    private http: HttpClient
  ) { }


  public getAllHatchingIncubators(): Observable<HatchingIncubator[]> {
    return this.http.get<any>(`${apiUrl}${ApiPaths.HatchingIncubatorPaths.GET_HATCHING_INCUBATOR}`).pipe(
      shareReplay(1),
      catchError(error => {
        return of();
      })
    );
  }

  public postHatchingIncubator(body: PostIncubatorRequest): Observable<any> {
    return this.http.post<any>(`${apiUrl}${ApiPaths.HatchingIncubatorPaths.POST_HATCHING_INCUBATOR}`, body);
  }
  
}
