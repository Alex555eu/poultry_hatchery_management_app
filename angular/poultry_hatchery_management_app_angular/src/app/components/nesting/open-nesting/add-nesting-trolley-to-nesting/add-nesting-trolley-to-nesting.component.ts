import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NestingLoadedDeliveriesService } from '../../../../services/nesting-loaded-deliveries/nesting-loaded-deliveries.service';
import { NestingTrolleyService } from '../../../../services/nesting-trolley/nesting-trolley.service';
import { NestingTrolley } from '../../../../models/nesting-trolley.model';
import { NestingLoadedDeliveries } from '../../../../models/nesting-loaded-deliveries.model';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-nesting-trolley-to-nesting',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    CommonModule
  ],
  templateUrl: './add-nesting-trolley-to-nesting.component.html',
  styleUrl: './add-nesting-trolley-to-nesting.component.css'
})
export class AddNestingTrolleyToNestingComponent implements OnInit {

  trolleys: NestingTrolley[] | null = null;

  private existingNLD: NestingLoadedDeliveries[] | null = null;

  constructor(
    private dialogRefParent: MatDialogRef<AddNestingTrolleyToNestingComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      nestingId: string
    },
    private nldService: NestingLoadedDeliveriesService,
    private nestingTrolleyService: NestingTrolleyService
  ){}

  ngOnInit(): void {
    this.nestingTrolleyService.getAllUnusedNestingTrolleys().subscribe(
      result => {
        if (result) {
          this.trolleys = result;
        }
      }
    )
    this.nldService.getAllNestingLoadedDeliveriesByNestingId(this.data.nestingId).subscribe(result => {
      if (result) {
        this.existingNLD = result;
      }
    })
  }

  addNestingTrolleyToNesting(trolley: NestingTrolley) {
    this.dialogRefParent.close(trolley);
  }

  onClose() {
    this.dialogRefParent.close(null);
  }

}
