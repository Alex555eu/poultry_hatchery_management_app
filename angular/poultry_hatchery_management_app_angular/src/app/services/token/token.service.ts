import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  set(authToken: string, refreshToken: string): void {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  clearAll(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }

}
