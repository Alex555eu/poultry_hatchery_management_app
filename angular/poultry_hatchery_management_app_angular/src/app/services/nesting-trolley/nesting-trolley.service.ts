import { Injectable } from '@angular/core';
import { NestingTrolley } from '../../models/nesting-trolley.model';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AddressDetails } from '../../models/address-details.model';
import { OrganisationDetails } from '../../models/organisation-details.model';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { PostTrolleyRequest } from '../../dto/post-trolley-request';

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
        map(res => this.parseResponseList(res)),
        shareReplay(1),
        catchError(error => {
          return of();
        })
      );
    }
    return this.nestingTrolleyAll$;
  }

  public postNestingTrolley(body: PostTrolleyRequest): Observable<any> {
    return this.http.post<any>(`${apiUrl}${ApiPaths.NestingTrolleyPaths.POST_NESTING_TROLLEY}`, body);
  }

  private parseResponseList(list: any[]): NestingTrolley[] {
    return list.map(listItem => this.parseResponse(listItem));
  }

  private parseResponse(json: any): NestingTrolley {
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
    return new NestingTrolley(
      json.id,
      json.humanReadableId,
      json.maxCapacity,
      organisation
    )
  }
}
