import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, shareReplay } from 'rxjs';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { Rejection2 } from '../../models/rejection2.model';
import { PostRejection2Request } from '../../dto/post-rejection2-request';
import { Rejection1 } from '../../models/rejection1.model';
import { PostRejection1Request } from '../../dto/post-rejection1-request';
import { Rejection3 } from '../../models/rejection3.model';
import { PostRejection3Request } from '../../dto/post-rejection3-request';
import { Rejection4 } from '../../models/rejection4.model';
import { PostRejection4Request } from '../../dto/post-rejection4-request';
import { PostRejectionUnexpectedRequest } from '../../dto/post-rejection-unexpected-request';

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

  public getAllRejection1(nestingId: string): Observable<Rejection1[]> {
    return this.http.get<Rejection1[]>(`${apiUrl + ApiPaths.RejectionPaths.GET_ALL_REJECTION_ONE_BY_NESTING_ID + nestingId}`).pipe(
      shareReplay(1),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  public postRejection1(body: PostRejection1Request): Observable<Rejection1> {
    return this.http.post<Rejection1>(`${apiUrl + ApiPaths.RejectionPaths.POST_REJECTION_ONE}`, body).pipe(
      catchError(error => {
        console.error(error);
        return of();
      })
    );
  }

  public deleteRejection1(rejectionId: string): Observable<any> {
    return this.http.delete<any>(`${apiUrl + ApiPaths.RejectionPaths.DELETE_REJECTION_ONE + rejectionId}`);
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


  public getAllRejection3ByHatching(hatchingId: string): Observable<Rejection3[]> {
    return this.http.get<Rejection3[]>(`${apiUrl + ApiPaths.RejectionPaths.GET_ALL_REJECTION_THREE_BY_HATCHING_ID + hatchingId}`).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  public getAllRejection3(hatchingId: string): Observable<Rejection3[]> {
    return this.http.get<Rejection3[]>(`${apiUrl + ApiPaths.RejectionPaths.GET_ALL_REJECTION_THREE_BY_HATCHING_ID + hatchingId}`).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  public getPossibleRejection3Causes(): Observable<string[]> {
    return this.http.get<string[]>(`${apiUrl + ApiPaths.RejectionPaths.REJECTION_CAUSES_THREE}`).pipe(
      shareReplay(1),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  public postRejection3(body: PostRejection3Request): Observable<Rejection3> {
    return this.http.post<Rejection3>(`${apiUrl + ApiPaths.RejectionPaths.POST_REJECTION_THREE}`, body).pipe(
      catchError(error => {
        console.error(error);
        return of();
      })
    );
  }  

  public deleteRejection3(rejectionId: string): Observable<any> {
    return this.http.delete<any>(`${apiUrl + ApiPaths.RejectionPaths.DELETE_REJECTION_THREE + rejectionId}`);
  }


  public getPossibleRejection4Causes(): Observable<string[]> {
    return this.http.get<string[]>(`${apiUrl + ApiPaths.RejectionPaths.REJECTION_CAUSES_FOUR}`).pipe(
      shareReplay(1),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }


  public getAllRejection4(nestingId: string): Observable<Rejection4[]> {
    return this.http.get<Rejection4[]>(`${apiUrl + ApiPaths.RejectionPaths.GET_ALL_REJECTION_FOUR_BY_NESTING_ID + nestingId}`).pipe(
      shareReplay(1),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }


  public postRejection4(body: PostRejection4Request): Observable<Rejection4> {
    return this.http.post<Rejection4>(`${apiUrl + ApiPaths.RejectionPaths.POST_REJECTION_FOUR}`, body).pipe(
      catchError(error => {
        console.error(error);
        return of();
      })
    );
  }

  public deleteRejection4(rejectionId: string): Observable<any> {
    return this.http.delete<any>(`${apiUrl + ApiPaths.RejectionPaths.DELETE_REJECTION_FOUR + rejectionId}`);
  }

  public postRejectionUnexpected(body: PostRejectionUnexpectedRequest): Observable<any> {
    return this.http.post<any>(`${apiUrl + ApiPaths.RejectionPaths.POST_REJECTION_UNEXPECTED}`, body).pipe(
      catchError(error => {
        console.error(error);
        return of();
      })
    );
  }
  
}
