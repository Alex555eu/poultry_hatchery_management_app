import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../app.config';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthResponse } from '../../dto/auth-response.model';
import { RegisterRequest } from '../../dto/register-request';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private http: HttpClient
  ) { }

  register(request: RegisterRequest): Observable<AuthResponse> {
    const body = JSON.stringify(request);
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<AuthResponse>(`${apiUrl}/api/v1/auth/register`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  };


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error status: ${error.status}, ` + `Mssg: ${error.error}`;
    }
    return throwError(() => new Error(errorMessage));
  }

}
