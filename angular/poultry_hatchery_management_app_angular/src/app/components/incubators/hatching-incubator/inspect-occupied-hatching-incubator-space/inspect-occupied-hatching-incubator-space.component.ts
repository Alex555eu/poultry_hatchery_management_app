import { Component, Inject, OnInit } from '@angular/core';
import { HatchingTrolleyContent } from '../../../../models/hatching-trolley-content.model';
import { HatchingTrolley } from '../../../../models/hatching-trolley.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-inspect-occupied-hatching-incubator-space',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    CommonModule    
  ],
  templateUrl: './inspect-occupied-hatching-incubator-space.component.html',
  styleUrl: './inspect-occupied-hatching-incubator-space.component.css'
})
export class InspectOccupiedHatchingIncubatorSpaceComponent implements OnInit {

  totalQuantity: number = 0;
  trolleyContent: HatchingTrolleyContent[] = [];
  trolley: HatchingTrolley | null = null;

  constructor(
    private dialogRefParent: MatDialogRef<InspectOccupiedHatchingIncubatorSpaceComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      trolley: HatchingTrolley,
      trolleyContent: HatchingTrolleyContent[]
    },
  ){}

  ngOnInit(): void {
    this.trolley = this.data.trolley;
    if (this.data.trolleyContent) {
      this.trolleyContent = this.data.trolleyContent;
      this.totalQuantity = this.trolleyContent.reduce((acc, it) => acc + it.quantity, 0)
    } 
  }

  onPermanentLeave() {
    this.dialogRefParent.close('PERMANENT');
  }

  onTemporaryLeave() {
    this.dialogRefParent.close('TEMPORARY');
  }

}
