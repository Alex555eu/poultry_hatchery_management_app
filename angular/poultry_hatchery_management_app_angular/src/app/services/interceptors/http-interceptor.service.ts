import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor{

  private tokenService: TokenService;

  constructor(
    tokenService: TokenService
  ) {
    this.tokenService = tokenService;
   }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `${this.tokenService.getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    return next.handle(clonedReq).pipe(
      catchError(error => {
        if (error.status === 401) { // Unauthorized

        }
        throw error;
      })
    );
  }


}
