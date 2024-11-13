import { Injectable } from '@angular/core';
import { NestingTrolleyIncubatorSpaceAssignment } from '../../models/nesting-trolley-incubator-space-assignment.model';

@Injectable({
  providedIn: 'root'
})
export class IncubatorPrinterService {

  constructor() { }

  getIncubatorLayout(capacity: number, columns: number): string[] {
    return this.prepareDataForPrinting(this.populateArray(capacity), columns);
  }

  getIncubatorLayout2(capacity: number, columns: number, assignments: NestingTrolleyIncubatorSpaceAssignment[]): NestingTrolleyIncubatorSpaceAssignment[] {
    return this.prepareDataForPrinting2(assignments, columns);
  }

  private prepareDataForPrinting(array: string[], cols: number): string[] {
    let result = Array();
    for(let i = 0, x = 0; i < array.length; i++, x++) {
      if (i === x && x === cols/2) {
        result.push('');
        x=0;
      }
      if (i > x && x === cols) { 
        result.push('');
        x=0;
      }
      result.push(array.at(i));
    }
    return result;
  }

  private prepareDataForPrinting2(array: NestingTrolleyIncubatorSpaceAssignment[], cols: number): NestingTrolleyIncubatorSpaceAssignment[] {
    let result = Array();
    for(let i = 0, x = 0; i < array.length; i++, x++) {
      if (i === x && x === cols/2) {
        result.push(null);
        x=0;
      }
      if (i > x && x === cols) { 
        result.push(null);
        x=0;
      }
      result.push(array.at(i));
    }
    return result;
  }

  private populateArray(amount: number): string[] {
    let result = new Array();
    for(let i = 0; i < amount; i++) {
      result.push('S' + (i+1));
    }
    return result;
  }




}
