import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }

  set(authToken: string, refreshToken: string) {
    const date = new Date();
    date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));
    
    const expires = "expires=" + date.toUTCString();

    document.cookie = 'authToken' + "=" + authToken + ";" + expires + ";path=/";
    document.cookie = 'refreshToken' + "=" + refreshToken + ";" + expires + ";path=/";
  }


}
