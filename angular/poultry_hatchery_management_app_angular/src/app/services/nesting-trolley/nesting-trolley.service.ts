import { Injectable } from '@angular/core';
import { NestingTrolley } from '../../models/nesting-trolley.model';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AddressDetails } from '../../models/address-details.model';
import { OrganisationDetails } from '../../models/organisation-details.model';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { PostTrolleyRequest } from '../../dto/post-trolley-request';
import { NestingTrolleyContent } from '../../models/nesting-trolley-content.model';
import { PostNestingTrolleyContentTransferRequest } from '../../dto/post-nesting-trolley-content-transfer-request';

@Injectable({
  providedIn: 'root'
})
export class NestingTrolleyService {

  private nestingTrolleyAll$: Observable<NestingTrolley[]> | null = null;

  constructor(
    private http: HttpClient
  ) { }

  public getAllNestingTrolleys(forceReload: boolean = false): Observable<NestingTrolley[]> {
    if (!this.nestingTrolleyAll$ || forceReload){
      this.nestingTrolleyAll$ = this.http.get<any>(`${apiUrl}${ApiPaths.NestingTrolleyPaths.GET_NESTING_TROLLEY}`).pipe(
        shareReplay(1),
        catchError(error => {
          return of([]);
        })
      );
    }
    return this.nestingTrolleyAll$;
  }

  public getAllNestingTrolleysFromOutsideOfIncubators(): Observable<NestingTrolley[]> {
    return this.nestingTrolleyAll$ = this.http.get<any>(`${apiUrl}${ApiPaths.NestingTrolleyPaths.GET_ALL_NESTING_TROLLEYS_FROM_OUTSIDE_OF_INCUBATORS}`).pipe(
      shareReplay(1),
      catchError(error => {
        return of([]);
      })
    );
  }

  public postNestingTrolley(body: PostTrolleyRequest): Observable<any> {
    return this.http.post<any>(`${apiUrl}${ApiPaths.NestingTrolleyPaths.POST_NESTING_TROLLEY}`, body);
  }

  public getNestingTrolleyContent(trolleyId: string): Observable<NestingTrolleyContent[]> {
    return this.http.get<NestingTrolleyContent[]>(`${apiUrl + ApiPaths.NestingTrolleyPaths.GET_NESTING_TROLLEY_CONTENT + trolleyId}`).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }

  public getNestingTrolleyContentByNestingId(nestingId: string): Observable<NestingTrolleyContent[]> {
    return this.http.get<NestingTrolleyContent[]>(`${apiUrl + ApiPaths.NestingTrolleyPaths.GET_NESTING_TROLLEY_CONTENT_BY_NESTING_ID + nestingId}`).pipe(
      catchError(error => {
        return of([]);
      })
    );
  } 

  public postNestingTrolleyContentTransfer(body: PostNestingTrolleyContentTransferRequest): Observable<NestingTrolleyContent[]> {
    return this.http.post<NestingTrolleyContent[]>(`${apiUrl + ApiPaths.NestingTrolleyPaths.POST_NESTING_TROLLEY_CONTENT_TRANSFER}`, body).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    )
  }

  

}
