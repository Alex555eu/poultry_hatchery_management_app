import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
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
    return this.http.post<AuthResponse>(`${apiUrl}${ApiPaths.AuthenticatePaths.POST_AUTHENTICATE}`, body).pipe(
      catchError(this.handleError)
    );
  };

  refreshToken(refreshToken: string | null): Observable<AuthResponse> {
    const body = {refreshToken: refreshToken};
    return this.http.post<AuthResponse>(`${apiUrl}${ApiPaths.AuthenticatePaths.POST_REFRESH}`, body);
  }

  logout(authToken: string | null): Observable<HttpEvent<any>> {
    const header = new HttpHeaders({Authorization: `${authToken}`});
    return this.http.post<HttpResponse<HttpEvent<any>>>(`${apiUrl}${ApiPaths.AuthenticatePaths.POST_LOGOUT}`, null, {headers: header});
  }

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
