import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { NestingLoadedDeliveries } from '../../models/nesting-loaded-deliveries.model';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { PostNestingLoadedDeliveryRequest } from '../../dto/post-nesting-loaded-delivery-request';

@Injectable({
  providedIn: 'root'
})
export class NestingLoadedDeliveriesService {

  constructor(
    private http: HttpClient
  ) { }

  public getAllNestingLoadedDeliveries(): Observable<NestingLoadedDeliveries[]> {
    return this.http.get<NestingLoadedDeliveries[]>(`${apiUrl + ApiPaths.NestingLoadedDeliveries.GET_ALL_NESTING_LOADED_DELIVERIES}`).pipe(
      catchError(error => {
        console.log(error);
        return of([])
      })
    )
  }

  public getAllNestingLoadedDeliveriesByNestingId(nestingId: string): Observable<NestingLoadedDeliveries[]> {
    return this.http.get<NestingLoadedDeliveries[]>(`${apiUrl + ApiPaths.NestingLoadedDeliveries.GET_ALL_NESTING_LOADED_DELIVERIES_BY_NESTING_ID + nestingId}`).pipe(
      catchError(error => {
        console.log(error);
        return of([])
      })
    )
  }

  public postNestingLoadedDelivery(body: PostNestingLoadedDeliveryRequest): Observable<NestingLoadedDeliveries> {
    return this.http.post<NestingLoadedDeliveries>(`${apiUrl + ApiPaths.NestingLoadedDeliveries.POST_NESTING_LOADED_DELIVERY}`, body).pipe(
      catchError(error => {
        return of()
      })
    )
  }

}
