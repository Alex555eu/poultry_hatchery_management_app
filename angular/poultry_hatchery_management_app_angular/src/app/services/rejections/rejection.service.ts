import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, shareReplay } from 'rxjs';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { Rejection2 } from '../../models/rejection2.model';
import { PostRejection2Request } from '../../dto/post-rejection2-request';

@Injectable({
  providedIn: 'root'
})
export class RejectionService {

  constructor(
    private http: HttpClient
  ) { }

  public getAllRejectionCauses(): Observable<string[]> {
    return this.http.get<string[]>(`${apiUrl + ApiPaths.RejectionPaths.ALL_REJECTION_CAUSES}`).pipe(
      shareReplay(1),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  public getPossibleRejection1Causes(): Observable<string[]> {
    return this.http.get<string[]>(`${apiUrl + ApiPaths.RejectionPaths.REJECTION_CAUSES_ONE}`).pipe(
      shareReplay(1),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  public getPossibleRejection2Causes(): Observable<string[]> {
    return this.http.get<string[]>(`${apiUrl + ApiPaths.RejectionPaths.REJECTION_CAUSES_TWO}`).pipe(
      shareReplay(1),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  public getAllRejection2(candlingId: string): Observable<Rejection2[]> {
    return this.http.get<Rejection2[]>(`${apiUrl + ApiPaths.RejectionPaths.GET_ALL_REJECTION_TWO_BY_CANDLING_ID + candlingId}`).pipe(
      shareReplay(1),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  public postRejection2(body: PostRejection2Request): Observable<Rejection2> {
    return this.http.post<Rejection2>(`${apiUrl + ApiPaths.RejectionPaths.POST_REJECTION_TWO}`, body).pipe(
      catchError(error => {
        console.error(error);
        return of();
      })
    );
  }

  public deleteRejection2(rejectionId: string): Observable<any> {
    return this.http.delete<any>(`${apiUrl + ApiPaths.RejectionPaths.DELETE_REJECTION_TWO + rejectionId}`);
  }




}
