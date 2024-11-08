import { Component, Inject } from '@angular/core';
import { NestingIncubator } from '../../../models/nesting-incubator.model';
import { NestingTrolleyIncubatorSpaceAssignment } from '../../../models/nesting-trolley-incubator-space-assignment.model';
import { TaskNestingTrolleyAssignment } from '../../../models/task-nesting-trolley-assignment.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NestingIncubatorService } from '../../../services/nesting-incubator/nesting-incubator.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-find-tasked-trolleys',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './find-tasked-trolleys.component.html',
  styleUrl: './find-tasked-trolleys.component.css'
})
export class FindTaskedTrolleysComponent {

  nestingTrolleyIncubatorSpaceAssignment: Map<NestingIncubator, NestingTrolleyIncubatorSpaceAssignment[]> = new Map();

  trolleyToIncubatorMapping: Map<NestingIncubator, TaskNestingTrolleyAssignment[]> = new Map();
  trolleyToIncubatorMappingKeys: NestingIncubator[] | null = null; // dynamic binding throws errors without it

  constructor(
    private dialogRef: MatDialogRef<FindTaskedTrolleysComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: {
        assignments: TaskNestingTrolleyAssignment[]
      },
    private incubatorService: NestingIncubatorService
  ) {}

  ngOnInit(): void {
    let incubators$ = this.incubatorService.getAllNestingIncubators();
    incubators$.subscribe(incubators => {
      this.trolleyToIncubatorMappingKeys = incubators;
      incubators.forEach(incubator => {
        let nestingTrolleyIncubatorSpaceAssignment$ = this.incubatorService.getAllTrolleysCurrentlyInIncubator(incubator.id);
        nestingTrolleyIncubatorSpaceAssignment$.subscribe(assignedSpaces => { 
          this.nestingTrolleyIncubatorSpaceAssignment.set(incubator, assignedSpaces);  
          let tmp = this.data.assignments ? this.data.assignments.filter(assignment => 
            assignedSpaces.some(assignedSpaces => assignedSpaces.nestingTrolley.id === assignment.nestingTrolley.id)
          ): [];

          this.trolleyToIncubatorMapping.set(incubator, tmp);
        })
      })
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  getSpaceId(incubator: NestingIncubator, trolleyId: string) {
    let tmp = this.nestingTrolleyIncubatorSpaceAssignment.get(incubator);
    return this.incubatorService.getIncubatorSpaceHumanReadableIdFromNestingTrolleyIncubatorSpaceAssignment(tmp ? tmp : [], trolleyId);
  }


  reloadIncubatorLayout(incubator: NestingIncubator): string[] {
    const maxCapacity = incubator.maxCapacity ?? 0;
    const numberOfColumns = incubator.numberOfColumns ?? 0;
    return this.prepareDataForPrinting(this.populateOutput(maxCapacity), numberOfColumns);
  }

  private prepareDataForPrinting(output: string[], cols: number): string[] {
    let result = Array();
    for(let i = 0, x = 0; i < output.length; i++, x++) {
      if (i === x && x === cols/2) { // push empty space
        result.push('');
        x=0;
      }
      if (i > x && x === cols) {     // push empty space
        result.push('');
        x=0;
      }
      result.push(output.at(i));     // push populated space
    }
    return result;
  }

  private populateOutput(amount: number): string[] {
    let result = new Array();
    for(let i = 0; i < amount; i++) {
      result.push('S' + (i+1));
    }
    return result;
  }
}
