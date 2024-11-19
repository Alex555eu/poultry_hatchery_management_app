import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter { 
  override getFirstDayOfWeek(): number {
    return 1; // sets first day in calendars to monday(1), instead of sunday(0)
  }
}
