import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Nesting } from '../../models/nesting.model';
import { catchError, Observable, of } from 'rxjs';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { PutNestingRequest } from '../../dto/put-nesting-request';

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

  public getAllNestings(): Observable<Nesting[]> {
    return this.http.get<Nesting[]>(`${apiUrl + ApiPaths.NestingPaths.GET_ALL_NESTINGS}`).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    )
  }

  public getNestingById(nestingId: string): Observable<Nesting> {
    return this.http.get<Nesting>(`${apiUrl + ApiPaths.NestingPaths.GET_NESTING_BY_ID + nestingId}`).pipe(
      catchError(error => {
        console.error(error);
        return of();
      })
    )
  }

  public postNewNesting(title: string, description: string): Observable<Nesting> {
    const body = {title: title, description: description};
    return this.http.post<Nesting>(`${apiUrl + ApiPaths.NestingPaths.POST_NEW_NESTING}`, body).pipe(
      catchError(error => {
        console.error(error);
        return of();
      })
    )
  }

  public putNesting(body: PutNestingRequest): Observable<Nesting> {
    return this.http.put<Nesting>(`${apiUrl + ApiPaths.NestingPaths.PUT_NESTING}`, body).pipe(
      catchError(error => {
        console.error(error);
        return of();
      })
    )
  }
  

}
