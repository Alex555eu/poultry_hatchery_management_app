import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { apiUrl } from '../../app.config';
import { AuthResponse } from '../../dto/auth-response.model';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiPaths } from '../../api/api.paths';
import { RegisterRequest } from '../../dto/register-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  register(request: RegisterRequest): Observable<AuthResponse> {
    const body = JSON.stringify(request);
    return this.http.post<AuthResponse>(`${apiUrl}${ApiPaths.AuthenticatePaths.POST_REGISTER}`, body).pipe(
      catchError(this.handleError)
    );
  };

  login(email: string, password: string): Observable<AuthResponse> {
    const body = { email: email, password: password };
    return this.http.post<AuthResponse>(`${apiUrl}${ApiPaths.AuthenticatePaths.POST_VALIDATE}`, body).pipe(
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
