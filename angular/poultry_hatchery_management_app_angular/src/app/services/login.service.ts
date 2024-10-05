import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { apiUrl } from '../app.config';
import { CookieService } from './cookie.service';
import { AuthResponse } from '../models/auth-response.model';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { 
    this.apiUrl = apiUrl;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const body = { email: email, password: password };
    return this.http.post<AuthResponse>(`${apiUrl}/api/v1/auth/validate`, body).pipe(
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
