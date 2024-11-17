import { NestingTrolleyIncubatorSpaceAssignment } from './../../models/nesting-trolley-incubator-space-assignment.model';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { NestingIncubator } from '../../models/nesting-incubator.model';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { AddressDetails } from '../../models/address-details.model';
import { OrganisationDetails } from '../../models/organisation-details.model';
import { PostIncubatorRequest } from '../../dto/post-incubator-request';
import { NestingTrolley } from '../../models/nesting-trolley.model';
import { NestingIncubatorSpace } from '../../models/nesting-incubator-space.model';
import { PostNestingTrolleyToIncubatorSpaceRequest } from '../../dto/post-nesting-trolley-to-incubator-space-request';

@Injectable({
  providedIn: 'root'
})
export class NestingIncubatorService {

  private nestingIncubatorsAll$: Observable<NestingIncubator[]> | null = null;

  constructor(
    private http: HttpClient
  ) { }


  //////////// NESTING INCUBATOR ////////////

  public getAllNestingIncubators(): Observable<NestingIncubator[]> {
    return this.http.get<any>(`${apiUrl}${ApiPaths.NestingIncubatorPaths.GET_ALL_NESTING_INCUBATORS}`).pipe(
      shareReplay(1),
      catchError(error => {
        return of([]);
      })
    );
  }

  public getNestingIncubatorById(incubatorId: string): Observable<NestingIncubator> {
    return this.http.get<NestingIncubator>(`${apiUrl}${ApiPaths.NestingIncubatorPaths.GET_NESTING_INCUBATOR}${incubatorId}`).pipe(
      shareReplay(1),
      catchError(error => {
        console.error(error);
        return of();
      })
    );
  }

  public postNestingIncubator(body: PostIncubatorRequest): Observable<any> {
    return this.http.post<any>(`${apiUrl}${ApiPaths.NestingIncubatorPaths.POST_NESTING_INCUBATOR}`, body);
  }

  //////////// INCUBATOR SPACE ////////////

  public getAllNestingIncubatorSpaces(incubatorId: string): Observable<NestingIncubatorSpace[]> {
    return this.http.get<NestingIncubatorSpace[]>(`${apiUrl + ApiPaths.NestingIncubatorPaths.GET_ALL_NESTING_INCUBATOR_SPACES + incubatorId}`).pipe(
      shareReplay(1),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    )
  }

  //////////// INCUBATOR OCCUPATION ////////////

  public getAllTrolleysCurrentlyInIncubator(incubatorId: string): Observable<NestingTrolleyIncubatorSpaceAssignment[]> {
    return this.http.get<NestingTrolleyIncubatorSpaceAssignment[]>(`${apiUrl}${ApiPaths.NestingIncubatorPaths.GET_NESTING_TROLLEY_CURR_IN_INCUBATOR_BY_INCUBATOR_ID}${incubatorId}`).pipe(
      shareReplay(1),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    )
  }

  public postNestingTrolleyToIncubatorSpace(body: PostNestingTrolleyToIncubatorSpaceRequest): Observable<NestingTrolleyIncubatorSpaceAssignment> {
    return this.http.post<NestingTrolleyIncubatorSpaceAssignment>(`${apiUrl + ApiPaths.NestingIncubatorPaths.POST_NESTING_TROLLEY_TO_INCUBATOR_SPACE}`, body).pipe(
      catchError(error => {
        console.error(error);
        return of();
      })
    )
  }

  public putNestingTrolleyToIncubatorSpace(assignmentId: string): Observable<NestingTrolleyIncubatorSpaceAssignment> {
    const body = {assignmentId: assignmentId};
    return this.http.put<NestingTrolleyIncubatorSpaceAssignment>(`${apiUrl + ApiPaths.NestingIncubatorPaths.PUT_NESTING_TROLLEY_TO_INCUBATOR_SPACE}`, body).pipe(
      catchError(error => {
        console.error(error);
        return of();
      })
    );
  }

  public deleteNestingTrolleyFromIncubatorSpace(assignmentId: string): Observable<any> {
    return this.http.delete<any>(`${apiUrl + ApiPaths.NestingIncubatorPaths.DELETE_NESTING_TROLLEY_FROM_INCUBATOR_SPACE + assignmentId}`).pipe(
      catchError(error => {
        console.error(error);
        return of();
      })
    );
  }

  //////////// NON API REQUESTS ////////////

  getIncubatorSpaceHumanReadableIdFromNestingTrolleyIncubatorSpaceAssignment(assignment: NestingTrolleyIncubatorSpaceAssignment[], trolleyId: string): string {
    let tmp = assignment.find(it => it.nestingTrolley.id === trolleyId);
    if (tmp) {
      return tmp.nestingIncubatorSpace.humanReadableId;
    }
    return '';
  }
  

}
