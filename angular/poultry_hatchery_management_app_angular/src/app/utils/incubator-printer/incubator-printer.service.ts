import { Injectable } from '@angular/core';
import { NestingTrolleyIncubatorSpaceAssignment } from '../../models/nesting-trolley-incubator-space-assignment.model';
import { NestingIncubatorSpace } from '../../models/nesting-incubator-space.model';

@Injectable({
  providedIn: 'root'
})
export class IncubatorPrinterService {

  constructor() { }

  getIncubatorLayout(capacity: number, columns: number): string[] {
    return this.prepareDataForPrinting(this.populateArray(capacity), columns);
  }

  getIncubatorLayout2(columns: number, spaces: NestingIncubatorSpace[]): NestingIncubatorSpace[] {
    let sortedArray = this.sortByHumanReadableId(spaces);
    return this.prepareDataForPrinting2(sortedArray, columns);
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

  private prepareDataForPrinting2(array: NestingIncubatorSpace[], cols: number): NestingIncubatorSpace[] {
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

  private sortByHumanReadableId(assignments: NestingIncubatorSpace[]): NestingIncubatorSpace[]{
    let arr = new Array(assignments.length);
    assignments.forEach(it => {
      let idx: number = +it.humanReadableId.slice(1);
      arr[idx-1] = it;
    })
    // 'assignments' passed straight from api
    //return arr.sort((it1, it2) => it1.humanReadableId > it2.humanReadableId ? 1 : -1);    
    return arr;
  } 

  private populateArray(amount: number): string[] {
    let result = new Array();
    for(let i = 0; i < amount; i++) {
      result.push('S' + (i+1));
    }
    return result;
  }




}
