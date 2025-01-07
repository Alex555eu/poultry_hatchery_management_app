import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Emergence } from '../../models/emergence.model';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { PostEmergenceRequest } from '../../dto/post-emergence-request';

@Injectable({
  providedIn: 'root'
})
export class EmergenceService {

  constructor(
    private http: HttpClient
  ) { }


  getAllEmergences(): Observable<Emergence[]> {
    return this.http.get<Emergence[]>(`${apiUrl + ApiPaths.HatchingPaths.GET_ALL_EMERGENCES}`).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  getEmergenceById(emergenceId: string): Observable<Emergence> {
    return this.http.get<Emergence>(`${apiUrl + ApiPaths.HatchingPaths.GET_EMERGENCE_BY_ID + emergenceId}`).pipe(
      catchError(error => {
        console.error(error);
        return of();
      })
    );
  }

  postEmergence(body: PostEmergenceRequest): Observable<Emergence> {
    return this.http.post<Emergence>(`${apiUrl + ApiPaths.HatchingPaths.POST_EMERGENCE}`, body).pipe(
      catchError(error => {
        console.error(error);
        return of();
      })
    );
  }

}
