import { NestingTrolley } from './../../../../models/nesting-trolley.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NestingTrolleyContent } from '../../../../models/nesting-trolley-content.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inspect-occupied-incubator-space',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './inspect-occupied-incubator-space.component.html',
  styleUrl: './inspect-occupied-incubator-space.component.css'
})
export class InspectOccupiedIncubatorSpaceComponent implements OnInit {

  totalQuantity: number = 0;
  trolleyContent: NestingTrolleyContent[] = [];
  trolley: NestingTrolley | null = null;

  constructor(
    private dialogRefParent: MatDialogRef<InspectOccupiedIncubatorSpaceComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      trolley: NestingTrolley,
      trolleyContent: NestingTrolleyContent[]
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
