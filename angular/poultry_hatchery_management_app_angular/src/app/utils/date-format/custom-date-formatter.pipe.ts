import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { CustomDateFormatterService } from './custom-date-formatter.service';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'customDateFormatter',
  standalone: true
})
export class CustomDateFormatterPipe implements PipeTransform {

  constructor(private dateFormatterService: CustomDateFormatterService) {}

  transform(value: Date, formatType: 'default' | 'full' = 'default'): string {
    if (!value) return 'Brak daty';

    if (formatType === 'full') {
      return this.dateFormatterService.formatDate2(value);
    } else {
      return this.dateFormatterService.formatDate(value);
    }
  }
}
