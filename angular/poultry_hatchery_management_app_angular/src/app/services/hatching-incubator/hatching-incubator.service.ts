import { Injectable } from '@angular/core';
import { HatchingIncubator } from '../../models/hatching-incubator.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { AddressDetails } from '../../models/address-details.model';
import { OrganisationDetails } from '../../models/organisation-details.model';
import { PostIncubatorRequest } from '../../dto/post-incubator-request';
import { HatchingIncubatorSpace } from '../../models/hatching-incubator-space.model';
import { HatchingTrolleyIncubatorSpaceAssignment } from '../../models/hatching-trolley-incubator-space-assignment.model';
import { PostHatchingTrolleyToIncubatorSpaceRequest } from '../../dto/post-hatching-trolley-to-incubator-space-request';

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
        return of([]);
      })
    );
  }

  public getHatchingIncubatorById(incubatorId: string): Observable<HatchingIncubator> {
    return this.http.get<HatchingIncubator>(`${apiUrl}${ApiPaths.HatchingIncubatorPaths.GET_HATCHING_INCUBATOR_BY_ID + incubatorId}`).pipe(
      shareReplay(1),
      catchError(error => {
        return of();
      })
    );
  }

  public postHatchingIncubator(body: PostIncubatorRequest): Observable<any> {
    return this.http.post<any>(`${apiUrl}${ApiPaths.HatchingIncubatorPaths.POST_HATCHING_INCUBATOR}`, body);
  }

  public getAllHatchingIncubatorSpaces(hatchingIncubatorId: string): Observable<HatchingIncubatorSpace[]> {
    return this.http.get<HatchingIncubatorSpace[]>(`${apiUrl + ApiPaths.HatchingIncubatorPaths.GET_HATCHING_INCUBATOR_SPACES + hatchingIncubatorId}`).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }


  public getAllTrolleysCurrentlyInIncubator(incubatorId: string): Observable<HatchingTrolleyIncubatorSpaceAssignment[]> {
    return this.http.get<HatchingTrolleyIncubatorSpaceAssignment[]>(`${apiUrl + ApiPaths.HatchingIncubatorPaths.GET_HATCHING_TROLLEY_INCUBATOR_SPACE_ASSIGNMENT + incubatorId}`).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }

  public deleteHatchingTrolleyFromIncubatorSpace(hatchingTrolleyIncubatorSpaceAssignmentId: string): Observable<any> {
    return this.http.delete<any>(`${apiUrl + ApiPaths.HatchingIncubatorPaths.DELETE_HATCHING_TROLLEY_FROM_INCUBATOR_SPACE + hatchingTrolleyIncubatorSpaceAssignmentId}`).pipe(
      catchError(error => {
        return of();
      })
    );
  }

  public postHatchingTrolleyToIncubatorSpace(body: PostHatchingTrolleyToIncubatorSpaceRequest): Observable<any> {
    return this.http.post<any>(`${apiUrl}${ApiPaths.HatchingIncubatorPaths.POST_HATCHING_TROLLEY_TO_INCUBATOR_SPACE}`, body).pipe(
      catchError(error => {
        return of();
      })
    );
  }
  
}
