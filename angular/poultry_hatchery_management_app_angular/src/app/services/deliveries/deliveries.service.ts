import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';
import { Delivery } from '../../models/delivery.model';
import { AddressDetails } from '../../models/address-details.model';
import { OrganisationDetails } from '../../models/organisation-details.model';
import { Supplier } from '../../models/supplier.model';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { ProductType } from '../../models/product-type.model';
import { PostDeliveryRequest } from '../../dto/post-delivery-request';

@Injectable({
  providedIn: 'root'
})
export class DeliveriesService {

  private deliveriesAll$: Observable<Delivery[]> | null = null;

  constructor(
    private http: HttpClient
  ) { }

  public getAllDeliveries(forceReload: boolean = false): Observable<Delivery[]> {
    if (!this.deliveriesAll$ || forceReload){
      this.deliveriesAll$ = this.http.get<any>(`${apiUrl}${ApiPaths.DeliveryPaths.GET_ALL_DELIVERIES}`).pipe(
        tap(response=> console.log(response)),
        map(res => this.parseResponseList(res)),
        shareReplay(1),
        catchError(error => {
          console.error(error);
          return of([]);
        })
      );
    }
    return this.deliveriesAll$;
  }

  public getAllProductTypes(): Observable<string[]> {
    return this.http.get<any>(`${apiUrl}${ApiPaths.DeliveryPaths.GET_ALL_PRODUCT_TYPES}`).pipe(
      shareReplay(1),
      catchError(error => {
        return of([]);
      })
    );
  }

  public postDelivery(request: PostDeliveryRequest): Observable<Delivery> {
    const body = JSON.stringify(request);
    return this.http.post<any>(`${apiUrl}${ApiPaths.DeliveryPaths.POST_DELIVERY}`, body).pipe(
      map(res => this.parseResponse(res)),
      catchError(error => {
        return of();
      })
    );
  }

  private parseResponseList(list: any[]): Delivery[] {
    return list.map(listItem => this.parseResponse(listItem));
  }

  private parseResponse(json: any): Delivery {
    const supplierAddress = new AddressDetails(
      json.supplier.address.id,
      json.supplier.address.city,
      json.supplier.address.postalCode,
      json.supplier.address.street,
      json.supplier.address.number
    );
    const organisationAddress = new AddressDetails(
      json.supplier.organisation.address.id,
      json.supplier.organisation.address.city,
      json.supplier.organisation.address.postalCode,
      json.supplier.organisation.address.street,
      json.supplier.organisation.address.number
    );
    const organisation = new OrganisationDetails(
      json.supplier.organisation.id,
      json.supplier.organisation.name,
      json.supplier.organisation.regon,
      organisationAddress
    );
    const supplier = new Supplier(
      json.supplier.id,
      json.supplier.name,
      json.supplier.surname,
      json.supplier.wni,
      supplierAddress,
      organisation
    );
    const type = new ProductType(
      json.productType.id,
      json.productType.name,
      organisation
    )
    return new Delivery(
      json.id,
      json.dateTime,
      json.quantity,
      type,
      supplier
    );

  }

}
