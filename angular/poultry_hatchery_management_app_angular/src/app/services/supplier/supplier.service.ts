import { Injectable } from '@angular/core';
import { Supplier } from '../../models/supplier.model';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { OrganisationDetails } from '../../models/organisation-details.model';
import { AddressDetails } from '../../models/address-details.model';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { PostSupplierRequest } from '../../dto/post-supplier-request';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private deliveriesAll$: Observable<Supplier[]> | null = null;

  constructor(
    private http: HttpClient
  ) { }

  public getAllSuppliers(forceReload: boolean = false): Observable<Supplier[]> {
    if (!this.deliveriesAll$ || forceReload){
      this.deliveriesAll$ = this.http.get<any>(`${apiUrl}${ApiPaths.DeliveryPaths.GET_ALL_SUPPLIERS}`).pipe(
        map(res => this.parseResponseList(res)),
        shareReplay(1),
        catchError(error => {
          return of();
        })
      );
    }
    return this.deliveriesAll$;
  }

  public postSupplier(request: PostSupplierRequest): Observable<Supplier> {
    const body = JSON.stringify(request);
    return this.http.post<any>(`${apiUrl}${ApiPaths.DeliveryPaths.POST_SUPPLIER}`, body).pipe(
      map(res => this.parseResponse(res)),
      catchError(error => {
        return of();
      })
    );;
  }

  private parseResponseList(list: any[]): Supplier[] {
    return list.map(listItem => this.parseResponse(listItem));
  }

  private parseResponse(json: any): Supplier {
    const supplierAddress = new AddressDetails(
      json.address.id,
      json.address.city,
      json.address.postalCode,
      json.address.street,
      json.address.number
    );
    const organisationAddress = new AddressDetails(
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
      organisationAddress
    );
    return new Supplier(
      json.id,
      json.name,
      json.surname,
      json.wni,
      supplierAddress,
      organisation
    );
  }
}
