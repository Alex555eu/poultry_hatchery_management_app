import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { Hatching } from '../../models/hatching.model';

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


}
