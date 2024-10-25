import { Injectable } from '@angular/core';
import { HatchingIncubator } from '../../models/hatching-incubator.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { AddressDetails } from '../../models/address-details.model';
import { OrganisationDetails } from '../../models/organisation-details.model';

@Injectable({
  providedIn: 'root'
})
export class HatchingIncubatorService {

  private hatchingIncubatorsAll$: Observable<HatchingIncubator[]> | null = null;

  constructor(
    private http: HttpClient
  ) { }

  public getAllHatchingIncubators(): Observable<HatchingIncubator[]> {
    if (!this.hatchingIncubatorsAll$){
      this.hatchingIncubatorsAll$ = this.http.get<any>(`${apiUrl}${ApiPaths.HatchingIncubatorPaths.GET_HATCHING_INCUBATOR}`).pipe(
        map(res => this.parseResponseList(res)),
        shareReplay(1),
        catchError(error => {
          return of();
        })
      );
    }
    return this.hatchingIncubatorsAll$;
  }

  private parseResponseList(list: any[]): HatchingIncubator[] {
    return list.map(listItem => this.parseResponse(listItem));
  }

  private parseResponse(json: any): HatchingIncubator {
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
    return new HatchingIncubator(
      json.id,
      json.maxCapacity,
      json.humanReadableId,
      organisation
    )
  }
}
