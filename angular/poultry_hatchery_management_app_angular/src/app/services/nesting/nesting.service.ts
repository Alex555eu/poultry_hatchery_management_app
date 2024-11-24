import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Nesting } from '../../models/nesting.model';
import { catchError, Observable, of } from 'rxjs';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';

@Injectable({
  providedIn: 'root'
})
export class NestingService {

  constructor(
    private http: HttpClient
  ) { }

  public getAllUnfinishedNestings(): Observable<Nesting[]> {
    return this.http.get<Nesting[]>(`${apiUrl + ApiPaths.NestingPaths.GET_ALL_UNFINISHED_NESTINGS}`).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    )
  }
  

}
