import { Injectable } from '@angular/core';
import { HatchingTrolley } from '../../models/hatching-trolley.model';
import { AddressDetails } from '../../models/address-details.model';
import { OrganisationDetails } from '../../models/organisation-details.model';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { HttpClient } from '@angular/common/http';
import { PostTrolleyRequest } from '../../dto/post-trolley-request';
import { HatchingTrolleyContent } from '../../models/hatching-trolley-content.model';
import { PostHatchingTrolleyContentRequest } from '../../dto/post-hatching-trolley-content-request';
import { PutHatchingTrolleyContentRequest } from '../../dto/put-hatching-trolley-content-request';

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
      this.hatchingTrolleyAll$ = this.http.get<HatchingTrolley[]>(`${apiUrl}${ApiPaths.HatchingTrolleyPaths.GET_HATCHING_TROLLEY}`).pipe(
        shareReplay(1),
        catchError(error => {
          return of([]);
        })
      );
    }
    return this.hatchingTrolleyAll$;
  }

  
  public getAllUnusedHatchingTrolleys(): Observable<HatchingTrolley[]> {
    return this.http.get<HatchingTrolley[]>(`${apiUrl + ApiPaths.HatchingTrolleyPaths.GET_UNUSED_HATCHING_TROLLEYS}`).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }
  public postHatchingTrolley(body: PostTrolleyRequest): Observable<any> {
    return this.http.post<any>(`${apiUrl}${ApiPaths.HatchingTrolleyPaths.POST_HATCHING_TROLLEY}`, body);
  }

  
  public getHatchingTrolleyContentByHatchingId(hatchingId: string): Observable<HatchingTrolleyContent[]> {
    return this.http.get<HatchingTrolleyContent[]>(`${apiUrl + ApiPaths.HatchingTrolleyPaths.GET_HATCHING_CONTENT_BY_HATCHING_ID + hatchingId}`).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }
  
  public postHatchingTrolleyContent(body: PostHatchingTrolleyContentRequest): Observable<any> {
    return this.http.post<any>(`${apiUrl + ApiPaths.HatchingTrolleyPaths.POST_HATCHING_TROLLEY_CONTENT}`, body).pipe(
      catchError(error => {
        return of();
      })
    );
  }

  public putHatchingTrolleyContent(body: PutHatchingTrolleyContentRequest): Observable<any> {
    return this.http.put<any>(`${apiUrl + ApiPaths.HatchingTrolleyPaths.PUT_HATCHING_TROLLEY_CONTENT}`, body).pipe(
      catchError(error => {
        return of();
      })
    );
  }

}
