import { NestingTrolleyIncubatorSpaceAssignment } from './../../models/nesting-trolley-incubator-space-assignment.model';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay, throwError } from 'rxjs';
import { NestingIncubator } from '../../models/nesting-incubator.model';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { AddressDetails } from '../../models/address-details.model';
import { OrganisationDetails } from '../../models/organisation-details.model';
import { PostIncubatorRequest } from '../../dto/post-incubator-request';
import { NestingTrolley } from '../../models/nesting-trolley.model';

@Injectable({
  providedIn: 'root'
})
export class NestingIncubatorService {

  private nestingIncubatorsAll$: Observable<NestingIncubator[]> | null = null;

  constructor(
    private http: HttpClient
  ) { }

  // public getAllNestingIncubators(): Observable<NestingIncubator[]> {
  //   if (!this.nestingIncubatorsAll$){
  //     this.nestingIncubatorsAll$ = this.http.get<any>(`${apiUrl}${ApiPaths.NestingIncubatorPaths.GET_NESTING_INCUBATOR}`).pipe(
  //       map(res => this.parseResponseList(res)),
  //       shareReplay(1),
  //       catchError(error => {
  //         return of();
  //       })
  //     );
  //   }
  //   return this.nestingIncubatorsAll$;
  // }

  public getAllNestingIncubators(): Observable<NestingIncubator[]> {
    return this.http.get<any>(`${apiUrl}${ApiPaths.NestingIncubatorPaths.GET_NESTING_INCUBATOR}`).pipe(
      map(res => this.parseResponseList(res)),
      shareReplay(1),
      catchError(error => {
        return of([]);
      })
    );
  }

  public postNestingIncubator(body: PostIncubatorRequest): Observable<any> {
    return this.http.post<any>(`${apiUrl}${ApiPaths.NestingIncubatorPaths.POST_NESTING_INCUBATOR}`, body);
  }



  public getAllTrolleysCurrentlyInIncubator(incubatorId: string): Observable<NestingTrolleyIncubatorSpaceAssignment[]> {
    return this.http.get<NestingTrolleyIncubatorSpaceAssignment[]>(`${apiUrl}${ApiPaths.NestingIncubatorPaths.GET_NESTING_TROLLEY_CURR_IN_INCUBATOR_BY_INCUBATOR_ID}${incubatorId}`).pipe(
      shareReplay(1),
      catchError(error => {
        return of([]);
      })
    )
  }

  getIncubatorSpaceHumanReadableIdFromNestingTrolleyIncubatorSpaceAssignment(assignment: NestingTrolleyIncubatorSpaceAssignment[], trolleyId: string): string {
    let tmp = assignment.find(it => it.nestingTrolley.id === trolleyId);
    if (tmp) {
      return tmp.nestingIncubatorSpace.humanReadableId;
    }
    return '';
  }
  

  private parseResponseList(list: any[]): NestingIncubator[] {
    return list.map(listItem => this.parseResponse(listItem));
  }

  private parseResponse(json: any): NestingIncubator {
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
    return new NestingIncubator(
      json.id,
      json.maxCapacity,
      json.numberOfColumns,
      json.humanReadableId,
      organisation
    )
  }
}
