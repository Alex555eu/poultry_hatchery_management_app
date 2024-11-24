import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpInterceptorService } from './services/interceptors/http-interceptor.service';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from './custom-date-adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(), 
    provideAnimationsAsync(), 
    provideNativeDateAdapter(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    { 
      provide: MAT_DATE_LOCALE, 
      useValue: 'pl-PL' 
    },
    {
      provide: DateAdapter, useClass: CustomDateAdapter
    }
  ]
};

export const apiUrl = 'http://localhost:9090';

export const TaskTypeEntityNameValueForCandling = 'SWIETLENIE';