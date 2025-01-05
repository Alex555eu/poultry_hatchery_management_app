import { HatchingTrolleyService } from './../../../../services/hatching-trolley/hatching-trolley.service';
import { Component, Inject, OnInit } from '@angular/core';
import { HatchingTrolley } from '../../../../models/hatching-trolley.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-hatching-trolley-to-hatching',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    CommonModule
  ],
  templateUrl: './add-hatching-trolley-to-hatching.component.html',
  styleUrl: './add-hatching-trolley-to-hatching.component.css'
})
export class AddHatchingTrolleyToHatchingComponent implements OnInit {

  trolleys: HatchingTrolley[] | null = null;

  constructor(
    private dialogRefParent: MatDialogRef<AddHatchingTrolleyToHatchingComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      hatchingId: string
    },
    private hatchingTrolleyService: HatchingTrolleyService
  ){}

  ngOnInit(): void {
    this.hatchingTrolleyService.getAllUnusedHatchingTrolleys().subscribe(
      result => {
        if (result) {
          this.trolleys = result;
        }
      }
    )
  }

  addHatchingTrolleyToNesting(trolley: HatchingTrolley) {
    this.dialogRefParent.close(trolley);
  }

  onClose() {
    this.dialogRefParent.close(null);
  }

}