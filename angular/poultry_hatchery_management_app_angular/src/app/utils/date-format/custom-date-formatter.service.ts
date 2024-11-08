import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomDateFormatterService {

  constructor() { }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    let newDate = new Date(date);
    if (newDate.getTime() === 0) {
      return 'Brak daty';
    }
    return newDate.toLocaleString("pl-PL", options);
  }

  formatDate2(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: false
    };
    let newDate = new Date(date);
    if (newDate.getTime() === 0) {
      return 'Brak daty';
    }
    return newDate.toLocaleString("pl-PL", options);
  }
}
