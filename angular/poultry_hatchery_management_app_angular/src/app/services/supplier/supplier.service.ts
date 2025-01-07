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
      catchError(error => {
        return of();
      })
    );;
  }

}
