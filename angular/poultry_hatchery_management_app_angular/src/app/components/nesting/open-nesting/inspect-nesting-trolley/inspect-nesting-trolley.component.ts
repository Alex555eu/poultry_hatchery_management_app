import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { NestingTrolleyContent } from '../../../../models/nesting-trolley-content.model';
import { NestingTrolley } from '../../../../models/nesting-trolley.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NestingLoadedDeliveries } from '../../../../models/nesting-loaded-deliveries.model';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CustomDateFormatterPipe } from '../../../../utils/date-format/custom-date-formatter.pipe';

@Component({
  selector: 'app-inspect-nesting-trolley',
  standalone: true,
  imports: [
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatInputModule,
    CustomDateFormatterPipe
  ],
  templateUrl: './inspect-nesting-trolley.component.html',
  styleUrl: './inspect-nesting-trolley.component.css'
})
export class InspectNestingTrolleyComponent implements OnInit {

  totalQuantity: number = 0;
  trolleyContent: NestingTrolleyContent[] = [];
  trolley: NestingTrolley | null = null;
  selectedNLD: NestingLoadedDeliveries | null = null;
  nestingAvailableQuantity: number = 0;

  quantity: number = 0;
  operationType: string = 'add';

  constructor(
    private dialogRefParent: MatDialogRef<InspectNestingTrolleyComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      trolley: NestingTrolley,
      trolleyContent: NestingTrolleyContent[],
      selectedNLD: NestingLoadedDeliveries
    }
  ){}

  ngOnInit(): void {
    this.trolley = this.data.trolley;
    this.selectedNLD = this.data.selectedNLD;
    if (this.data.trolleyContent) {
      this.trolleyContent = this.data.trolleyContent;
      this.totalQuantity = this.trolleyContent.reduce((acc, it) => acc + it.quantity, 0)
    } 
    this.nestingAvailableQuantity = this.selectedNLD.delivery.quantity - this.selectedNLD.quantity;
  }

  private isFormValid(): boolean {
    return this.selectedNLD !== null && !isNaN(this.quantity) && this.quantity > 0 && this.operationType !== null;
  }

  confirmOperation(): void {
    if (this.isFormValid()) {
      console.log('worked')
    }
  }


}
