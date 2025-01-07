import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { HatchingIncubator } from '../../../models/hatching-incubator.model';
import { HatchingIncubatorSpace } from '../../../models/hatching-incubator-space.model';
import { HatchingTrolleyIncubatorSpaceAssignment } from '../../../models/hatching-trolley-incubator-space-assignment.model';
import { HatchingTrolleyContent } from '../../../models/hatching-trolley-content.model';
import { HatchingIncubatorService } from '../../../services/hatching-incubator/hatching-incubator.service';
import { HatchingTrolleyService } from '../../../services/hatching-trolley/hatching-trolley.service';
import { IncubatorPrinterService } from '../../../utils/incubator-printer/incubator-printer.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { TasksSectionComponent } from '../../tasks/tasks-section/tasks-section.component';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { from, mergeMap, Observable, switchMap, tap } from 'rxjs';
import { InspectUnoccupiedHatchingIncubatorSpaceComponent } from './inspect-unoccupied-hatching-incubator-space/inspect-unoccupied-hatching-incubator-space.component';
import { InspectOccupiedHatchingIncubatorSpaceComponent } from './inspect-occupied-hatching-incubator-space/inspect-occupied-hatching-incubator-space.component';

@Component({
  selector: 'app-hatching-incubator',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatGridListModule,
    MatIconModule,
    TasksSectionComponent,
    MatDialogModule,
    MatButtonModule    
  ],
  templateUrl: './hatching-incubator.component.html',
  styleUrl: './hatching-incubator.component.css'
})
export class HatchingIncubatorComponent implements OnInit {

  incubator: HatchingIncubator | null = null;
  incubatorSpaces: HatchingIncubatorSpace[] = []
  
  private incubatorSpaceAssignments: HatchingTrolleyIncubatorSpaceAssignment[] = [];
  private trolleysContent: HatchingTrolleyContent[][] = [];
  private mappingContent = new Map<string, HatchingTrolleyContent[]>();

  @ViewChildren('tile') private tiles!: QueryList<ElementRef>;

    constructor(
      private hatchingIncubatorService: HatchingIncubatorService,
      private hatchingTrolleyService: HatchingTrolleyService,
      private incubatorPrinterService: IncubatorPrinterService,
      private route: ActivatedRoute,
      private dialog: MatDialog,
      private snackBar: MatSnackBar,
      private cdr: ChangeDetectorRef
    ) {}

ngOnInit(): void { 
    this.route.queryParamMap.pipe(
      switchMap(params => {
        const query = params.get('id');
        if (query)
          return this.hatchingIncubatorService.getHatchingIncubatorById(query);
        return [];
      }),
      switchMap(incubator => {
        this.incubator = incubator;
        this.getIncubatorSpaces(incubator);
        return this.getAllTrolleysCurrentlyInIncubator(incubator.id);
      })
    ).subscribe();
  }


  findTrolleySpaceAssignment(space: HatchingIncubatorSpace): HatchingTrolleyIncubatorSpaceAssignment | null{
    return this.incubatorSpaceAssignments?.find(it => it.hatchingIncubatorSpace.id === space.id) || null;
  }


  getTileColorClass(space: HatchingIncubatorSpace): string {
    let assignment: HatchingTrolleyIncubatorSpaceAssignment | null = this.findTrolleySpaceAssignment(space);
    if (assignment) {
      return 'currently-occupied'
    }
    return 'empty';
  }


  inspectIncubatorSpace(space: HatchingIncubatorSpace) {
    const assignment = this.findTrolleySpaceAssignment(space);
    if (assignment) {
      this.incubatorSpaceCurrentlyOccupied(assignment);
    } else {
      this.incubatorSpaceEmpty(space);
    }
  }
  
  



  private incubatorSpaceCurrentlyOccupied(assignment: HatchingTrolleyIncubatorSpaceAssignment) {
    let config = new MatDialogConfig();
    config.data = {
      trolley: assignment.hatchingTrolley,
      trolleyContent: [this.mappingContent.get(assignment.hatchingTrolley.id)]
    }
    let dialogRef = this.dialog.open(InspectOccupiedHatchingIncubatorSpaceComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      switch (result) {
        case 'PERMANENT': {
          let ob$ = this.hatchingIncubatorService.deleteHatchingTrolleyFromIncubatorSpace(assignment.id);
          ob$.subscribe(() => {
              this.ngOnInit();
          })
          break;
        }
      }
    })
  }




  private incubatorSpaceEmpty(incubatorSpace: HatchingIncubatorSpace) {
    let config = new MatDialogConfig();
    config.data = {
      incubatorSpace: incubatorSpace
    }
    let dialogRef = this.dialog.open(InspectUnoccupiedHatchingIncubatorSpaceComponent, config);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.ngOnInit();
      }
    })
  }


  private getIncubatorSpaces(incubator: HatchingIncubator) {
    let incubatorSpaces$ = this.hatchingIncubatorService.getAllHatchingIncubatorSpaces(incubator.id);
    incubatorSpaces$.subscribe(response => {
      this.incubatorSpaces =  this.incubatorPrinterService.getIncubatorLayout2(incubator.numberOfColumns, response); 
    });
  }


  private getAllTrolleysCurrentlyInIncubator(incubatorId: string): Observable<any> {
    return this.hatchingIncubatorService.getAllTrolleysCurrentlyInIncubator(incubatorId).pipe(
      tap(response => {
        this.incubatorSpaceAssignments = response;
      }),
      switchMap(response => this.getTrolleyContents(response))
    )
  }


  private getTrolleyContents(response: HatchingTrolleyIncubatorSpaceAssignment[]): Observable<any> {
    return from(response).pipe(
      mergeMap(assignment => 
        this.hatchingTrolleyService.getHatchingTrolleyContent(assignment.hatchingTrolley.id).pipe(
          tap(trolleyContentResponse => {
            this.trolleysContent.push(trolleyContentResponse)
            this.mappingContent.set(assignment.hatchingTrolley.id, trolleyContentResponse);
          })
        )
      )
    );
  }






}
