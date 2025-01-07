import { HatchingLoadedDeliveries } from './../../../../models/hatching-loaded-deliveries.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HatchingTrolley } from '../../../../models/hatching-trolley.model';
import { HatchingTrolleyContent } from '../../../../models/hatching-trolley-content.model';
import { Nesting } from '../../../../models/nesting.model';
import { NestingTrolley } from '../../../../models/nesting-trolley.model';
import { NestingTrolleyContent } from '../../../../models/nesting-trolley-content.model';
import { NestingTrolleyService } from '../../../../services/nesting-trolley/nesting-trolley.service';
import { HatchingTrolleyService } from '../../../../services/hatching-trolley/hatching-trolley.service';
import { CustomDateFormatterPipe } from '../../../../utils/date-format/custom-date-formatter.pipe';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-inspect-hatching-trolley',
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
    CustomDateFormatterPipe,
    MatRadioModule
  ],
  templateUrl: './inspect-hatching-trolley.component.html',
  styleUrl: './inspect-hatching-trolley.component.css'
})
export class InspectHatchingTrolleyComponent implements OnInit {

  totalQuantityNesting: number = 0;
  totalQuantityHatching: number = 0;

  hatchingTrolley: HatchingTrolley | null = null;
  hatchingTrolleyContent: HatchingTrolleyContent[] = [];
  nestingTrolley: NestingTrolley | null = null;
  nestingTrolleyContent: NestingTrolleyContent[] = [];

  hld: HatchingLoadedDeliveries[] = [];

  quantity: number = 0;

  selectedNestingTrolleyContent: NestingTrolleyContent | null = null;
  selectedHatchingTrolleyContent: HatchingTrolleyContent | null = null;

  constructor(
    private dialogRefParent: MatDialogRef<InspectHatchingTrolleyComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      hatchingTrolley: HatchingTrolley,
      hatchingTrolleyContent: HatchingTrolleyContent[],
      nestingTrolley: NestingTrolley,
      nestingTrolleyContent: NestingTrolleyContent[],
      hatchingLoadedDeliveries: HatchingLoadedDeliveries[]
    },
    private nestingTrolleyService: NestingTrolleyService,
    private hatchingTrolleyService: HatchingTrolleyService,
    private snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
    this.hld = this.data.hatchingLoadedDeliveries;
    this.nestingTrolley = this.data.nestingTrolley;
    this.hatchingTrolley = this.data.hatchingTrolley;
    if (this.data.nestingTrolleyContent) {
      this.nestingTrolleyContent = this.data.nestingTrolleyContent;
      this.totalQuantityNesting = this.nestingTrolleyContent.reduce((acc, it) => acc + it.quantity, 0)
    } 
    if (this.data.hatchingTrolleyContent) {
      this.hatchingTrolleyContent = this.data.hatchingTrolleyContent;
      this.totalQuantityHatching = this.hatchingTrolleyContent.reduce((acc, it) => acc + it.quantity, 0)  
    }
  }

  confirmOperation() {
    if (this.isFormValid()) {
        if (this.selectedNestingTrolleyContent!.quantity >= this.quantity) {
          if (this.selectedNestingTrolleyContent!.quantity == this.quantity) {
            this.nestingTrolleyService.deleteNestingTrolleyContent(this.selectedNestingTrolleyContent!.id).subscribe();
          } else {
            this.nestingTrolleyService.putNestingTrolleyContent({
              contentId: this.selectedNestingTrolleyContent!.id,
              quantity: (this.selectedNestingTrolleyContent!.quantity - this.quantity)
            }).subscribe();
          }
          const tmpContent = this.hatchingTrolleyContent.find(item => item.hatchingLoadedDeliveries.delivery.id === this.selectedNestingTrolleyContent?.nestingLoadedDeliveries.delivery.id);
          if (tmpContent) {
          this.hatchingTrolleyService.putHatchingTrolleyContent({
            hatchingTrolleyContentId: tmpContent.id,
            hatchingLoadedDeliveriesId: tmpContent.hatchingLoadedDeliveries.id,
            quantity: (tmpContent.quantity + this.quantity)
          }).subscribe();
          } else {
          const tmpHLD = this.hld.find(item => item.delivery.id === this.selectedNestingTrolleyContent?.nestingLoadedDeliveries.delivery.id);
          this.hatchingTrolleyService.postHatchingTrolleyContent({
            hatchingTrolleyId: this.hatchingTrolley!.id,
            hatchingLoadedDeliveriesId: tmpHLD!.id,
            quantity: this.quantity
          }).subscribe();
          }
        } else {
          this.snackBar.open('Brak takiej ilości na wózku lęgowym', 'Zamknij', {
            duration: 5000, // millis
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
    }
    this.dialogRefParent.close(true);
  }

  isFormValid(): boolean {
    return this.selectedNestingTrolleyContent != null && !isNaN(this.quantity) && this.quantity > 0;
  }

  onHatchingContentSelected(content: HatchingTrolleyContent) {
    this.selectedHatchingTrolleyContent = content;
  }

}
