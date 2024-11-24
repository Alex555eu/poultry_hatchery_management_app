import { Injectable } from '@angular/core';
import { HatchingTrolley } from '../../models/hatching-trolley.model';
import { AddressDetails } from '../../models/address-details.model';
import { OrganisationDetails } from '../../models/organisation-details.model';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { HttpClient } from '@angular/common/http';
import { PostTrolleyRequest } from '../../dto/post-trolley-request';

@Injectable({
  providedIn: 'root'
})
export class HatchingTrolleyService {

  private hatchingTrolleyAll$: Observable<HatchingTrolley[]> | null = null;

  constructor(
    private http: HttpClient
  ) { }

  public getAllHatchingTrolleys(forceReload: boolean = false): Observable<HatchingTrolley[]> {
    if (!this.hatchingTrolleyAll$ || forceReload){
      this.hatchingTrolleyAll$ = this.http.get<any>(`${apiUrl}${ApiPaths.HatchingTrolleyPaths.GET_HATCHING_TROLLEY}`).pipe(
        shareReplay(1),
        catchError(error => {
          return of();
        })
      );
    }
    return this.hatchingTrolleyAll$;
  }

  public postHatchingTrolley(body: PostTrolleyRequest): Observable<any> {
    return this.http.post<any>(`${apiUrl}${ApiPaths.HatchingTrolleyPaths.POST_HATCHING_TROLLEY}`, body);
  }

}
