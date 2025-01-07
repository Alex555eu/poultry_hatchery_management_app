import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { Hatching } from '../../models/hatching.model';
import { PostHatchingRequest } from '../../dto/post-hatching-request';
import { HatchingLoadedDeliveries } from '../../models/hatching-loaded-deliveries.model';
import { HatchingResult } from '../../models/hatching-result.model';

@Injectable({
  providedIn: 'root'
})
export class HatchingService {

  constructor(
    private http: HttpClient
  ) { }


  getAllHatchings(): Observable<Hatching[]> {
    return this.http.get<Hatching[]>(`${apiUrl + ApiPaths.HatchingPaths.GET_ALL_HATCHINGS}`).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  getHatchingById(hatchingId: string): Observable<Hatching> {
    return this.http.get<Hatching>(`${apiUrl + ApiPaths.HatchingPaths.GET_HATCHING_BY_ID + hatchingId}`).pipe(
      catchError(error => {
        console.error(error);
        return of();
      })
    );
  }

  postHatching(body: PostHatchingRequest): Observable<Hatching> {
    return this.http.post<Hatching>(`${apiUrl + ApiPaths.HatchingPaths.POST_HATCHING}`, body).pipe(
      catchError(error => {
        console.error(error);
        return of();
      })
    );
  }

  getHatchingLoadedDeliveriesByHatchingId(hatchingId: string): Observable<HatchingLoadedDeliveries[]> {
    return this.http.get<HatchingLoadedDeliveries[]>(`${apiUrl + ApiPaths.HatchingPaths.GET_HATCHING_LOADED_DELIVERIES_BY_HATCHING_ID + hatchingId}`)
  }

  getAllHatchingResults(hatchingId: string): Observable<HatchingResult[]> {
    return this.http.get<HatchingResult[]>(`${apiUrl + ApiPaths.HatchingPaths.GET_ALL_HATCHING_RESULTS + hatchingId}`).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

}
