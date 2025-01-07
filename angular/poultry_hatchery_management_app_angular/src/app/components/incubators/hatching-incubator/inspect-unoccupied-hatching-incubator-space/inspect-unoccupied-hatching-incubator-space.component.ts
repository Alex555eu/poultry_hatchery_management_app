import { Component, Inject } from '@angular/core';
import { HatchingTrolley } from '../../../../models/hatching-trolley.model';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HatchingIncubatorSpace } from '../../../../models/hatching-incubator-space.model';
import { HatchingIncubatorService } from '../../../../services/hatching-incubator/hatching-incubator.service';
import { HatchingTrolleyService } from '../../../../services/hatching-trolley/hatching-trolley.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostHatchingTrolleyToIncubatorSpaceRequest } from '../../../../dto/post-hatching-trolley-to-incubator-space-request';
import { CustomDateFormatterPipe } from '../../../../utils/date-format/custom-date-formatter.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-inspect-unoccupied-hatching-incubator-space',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    CommonModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    CustomDateFormatterPipe    
  ],
  templateUrl: './inspect-unoccupied-hatching-incubator-space.component.html',
  styleUrl: './inspect-unoccupied-hatching-incubator-space.component.css'
})
export class InspectUnoccupiedHatchingIncubatorSpaceComponent {

  allAvailableTrolleys$!: Observable<HatchingTrolley[]>;
  selectedTrolley$ = new BehaviorSubject<HatchingTrolley | null>(null);
  
  
  constructor(
    private dialogRefParent: MatDialogRef<InspectUnoccupiedHatchingIncubatorSpaceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      incubatorSpace: HatchingIncubatorSpace
    },
    private incubatorService: HatchingIncubatorService,
    private trolleyService: HatchingTrolleyService,
    private snackBar: MatSnackBar
  ){}


  ngOnInit(): void {
    this.allAvailableTrolleys$ = this.trolleyService.getAllNestingTrolleysFromOutsideOfIncubators();
  }

  
  onTrolleySelectionChange(trolley: HatchingTrolley | null): void {
    this.selectedTrolley$.next(trolley);
  }


  submitSelection() {
    if (this.selectedTrolley$.value){
      const body: PostHatchingTrolleyToIncubatorSpaceRequest = {
        hatchingTrolleyId: this.selectedTrolley$.value?.id,
        hatchingIncubatorSpaceId: this.data.incubatorSpace.id
      }
      let ob$ = this.incubatorService.postHatchingTrolleyToIncubatorSpace(body).subscribe();

      this.dialogRefParent.close(ob$);

    } else {
      this.snackBar.open('Opps, coś poszło nie tak', 'Zamknij', {
        duration: 5000, // millis
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }


  onClose() {
    this.dialogRefParent.close();
  }




}
