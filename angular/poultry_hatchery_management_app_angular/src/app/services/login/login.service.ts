import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { apiUrl } from '../../app.config';
import { AuthResponse } from '../../dto/auth-response.model';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenticatePaths } from '../../api/api.paths';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

  login(email: string, password: string): Observable<AuthResponse> {
    const body = { email: email, password: password };
    return this.http.post<AuthResponse>(`${apiUrl}${AuthenticatePaths.POST_VALIDATE}`, body).pipe(
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
