import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { TokenService } from '../token/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../authorization/auth.service';
import { ApiPaths } from '../../api/api.paths';
import { AuthResponse } from '../../dto/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  private isCurrentlyRefreshingToken = false;
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.includes(ApiPaths.AuthenticatePaths.POST_REFRESH)  ||
        req.url.includes(ApiPaths.AuthenticatePaths.POST_LOGOUT)   ||
        req.url.includes(ApiPaths.AuthenticatePaths.POST_AUTHENTICATE) ||
        req.url.includes(ApiPaths.AuthenticatePaths.POST_REGISTER)
      ) {
      return next.handle(req); 
    }

    const authToken = this.tokenService.getAuthToken();
    let clonedReq = req;

    if (authToken) {
      clonedReq = req.clone({
        setHeaders: {
          Authorization: `${authToken}`,
          'Content-Type': 'application/json'
        }
      });
    }

    return next.handle(clonedReq).pipe(
      catchError(error => {
        if (error.status === 401) { // Unauthorized
          return this.handleRefreshToken(req, next);
        }
        if (error.status === 403) {
          return this.handleForbidden();
        }
        return throwError(() => error);
      })
    );
  }

  private handleRefreshToken(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = this.tokenService.getRefreshToken();
    
    if (!refreshToken) {
      this.router.navigate(['login']);
      return of();
    }

    if (!this.isCurrentlyRefreshingToken) {
      this.isCurrentlyRefreshingToken = true;
      this.tokenSubject.next(null);

      return this.authService.refreshToken(refreshToken).pipe( 
        switchMap((data: AuthResponse) => {
          this.isCurrentlyRefreshingToken = false;
          this.tokenService.set(data.token, data.refreshToken); // Save new tokens
          this.tokenSubject.next(data.token);                   // Update BehaviorSubject with new token

          const newReq = req.clone({                            // Repeat original request with updated tokens
            setHeaders: {
              Authorization: `${data.token}`,
              'Content-Type': 'application/json'
            }
          });
          return next.handle(newReq);
        }),
        catchError(error => {
          this.isCurrentlyRefreshingToken = false;
          return this.handleLogout();
        })
      );
    } else {
      return this.tokenSubject.pipe(
        filter(token => token != null), // Wait for token update
        take(1),                        // Take first token value
        switchMap(token => {            // Resume original request with updated tokens
          const newReq = req.clone({
            setHeaders: {
              Authorization: `${token}`,
              'Content-Type': 'application/json'
            }
          });
          return next.handle(newReq);
        })
      );
    }
  }

  private handleLogout(): Observable<HttpEvent<any>> {
    const authToken = this.tokenService.getAuthToken();
    if (!authToken) {
      this.router.navigate(['login']);
      window.location.reload();
      return of();
    }
    return this.authService.logout(authToken).pipe(
      tap(() => {
        this.tokenService.clearAll();
        this.router.navigate(['login']);
        window.location.reload();
      }),
      catchError(err => {
        this.tokenService.clearAll();
        this.router.navigate(['login']);
        window.location.reload();
        return throwError(() => err);
      })
    );
  }
  
  private handleForbidden(): Observable<HttpEvent<any>> {
    this.router.navigate(['forbidden']);
    return of();
  }

}

/*
  intercept:
    1* ignore authorization requests
    2* add authorization header to all requests (other than 1*)
    3* execute request
    4* catch errors:
    5* if err == 401 then make new request to refresh token
    6A* execute refresh token request
      7* catch errors:
      8* if err == 401 then make new request to logout user
      9* execute logout request
      10* catch errors and and handle them 
    6B* if token is already being refreshed stop at BehaviourSubject
    6B* and wait for it to be updated with new token by a request that is alredy refreshing token (first one)
    6C* repeat original request with new tokens
       
*/