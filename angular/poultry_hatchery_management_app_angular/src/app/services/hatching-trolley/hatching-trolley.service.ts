import { Injectable } from '@angular/core';
import { HatchingTrolley } from '../../models/hatching-trolley.model';
import { AddressDetails } from '../../models/address-details.model';
import { OrganisationDetails } from '../../models/organisation-details.model';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HatchingTrolleyService {

  private hatchingTrolleyAll$: Observable<HatchingTrolley[]> | null = null;

  constructor(
    private http: HttpClient
  ) { }

  public getAllHatchingTrolleys(): Observable<HatchingTrolley[]> {
    if (!this.hatchingTrolleyAll$){
      this.hatchingTrolleyAll$ = this.http.get<any>(`${apiUrl}${ApiPaths.HatchingTrolleyPaths.GET_HATCHING_TROLLEY}`).pipe(
        map(res => this.parseResponseList(res)),
        shareReplay(1),
        catchError(error => {
          return of();
        })
      );
    }
    return this.hatchingTrolleyAll$;
  }

  private parseResponseList(list: any[]): HatchingTrolley[] {
    return list.map(listItem => this.parseResponse(listItem));
  }

  private parseResponse(json: any): HatchingTrolley {
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
    return new HatchingTrolley(
      json.id,
      json.humanReadableId,
      organisation
    )
  }
}
