import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Candling } from '../../models/candling.model';
import { catchError, Observable, of, shareReplay } from 'rxjs';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { PostCandlingRequest } from '../../dto/post-candling-request';
import { CandlingNestingTrolleyAssignment } from '../../models/candling-nesting-trolley-assignment.model';
import { PostCandlingNestingTrolleyAssignmentRequest } from '../../dto/post-candling-nesting-trolley-assignment-request';

@Injectable({
  providedIn: 'root'
})
export class CandlingService {

  constructor(
    private http: HttpClient
  ) { }

  getCandlingByTaskId(taskId: string): Observable<Candling|null> {
    return this.http.get<Candling>(`${apiUrl + ApiPaths.CandlingPaths.GET_CANDLING_BY_TASK_ID + taskId}`).pipe(
      shareReplay(1),
      catchError(error => {
        return of(null);
      })
    );
  }

  getAllCandlings(): Observable<Candling[]> {
    return this.http.get<Candling[]>(`${apiUrl + ApiPaths.CandlingPaths.GET_ALL_CANDLINGS}`).pipe(
      shareReplay(1),
      catchError(error => {
        return of([]);
      })
    );
  }

  getCandlingById(candlingId: string): Observable<Candling> {
    return this.http.get<Candling>(`${apiUrl + ApiPaths.CandlingPaths.GET_CANDLING_BY_ID + candlingId}`).pipe(
      shareReplay(1),
      catchError(error => {
        return of();
      })
    );
  }

  postCandling(body: PostCandlingRequest): Observable<Candling> {
    return this.http.post<Candling>(`${apiUrl + ApiPaths.CandlingPaths.POST_CANDLING}`, body).pipe(
      catchError(error => {
        return of();
      })
    );
  }

  putCandling(body: Candling): Observable<Candling> {
    return this.http.put<Candling>(`${apiUrl + ApiPaths.CandlingPaths.PUT_CANDLING}`, body).pipe(
      catchError(error => {
        return of();
      })
    );
  }

  deleteCandling(candlingId: string): Observable<any> {
    return this.http.delete<any>(`${apiUrl + ApiPaths.CandlingPaths.DELETE_CANDLING + candlingId}`).pipe(
      catchError(error => {
        return of();
      })
    );
  }

  ///////////////// CANDLING - NESTING TROLLEY ASSIGNMENTS ///////////////////////////////

  getAllCandlingTrolleyAssignments(candlingId: string): Observable<CandlingNestingTrolleyAssignment[]> {
    return this.http.get<CandlingNestingTrolleyAssignment[]>(`${apiUrl + ApiPaths.CandlingPaths.GET_ALL_CANDLING_TROLLEY_ASSIGNMENTS + candlingId}`).pipe(
      shareReplay(1),
      catchError(error => {
        return of([]);
      })
    );
  }

  postCandlingTrolleyAssignment(body: PostCandlingNestingTrolleyAssignmentRequest): Observable<CandlingNestingTrolleyAssignment> {
    return this.http.post<CandlingNestingTrolleyAssignment>(`${apiUrl + ApiPaths.CandlingPaths.POST_CANDLING_TROLLEY_ASSIGNMENT}`, body).pipe(
      catchError(error => {
        return of();
      })
    );
  }

  deleteCandlingNestingTrolleyAssignment(candlingAssignmentId: string): Observable<any> {
    return this.http.delete<any>(`${apiUrl + ApiPaths.CandlingPaths.DELETE_CANDLING_TROLLEY_ASSIGNMENT + candlingAssignmentId}`).pipe(
      catchError(error => {
        return of();
      })
    );
  }


}
