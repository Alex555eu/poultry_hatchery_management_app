import { Component, Inject, OnInit } from '@angular/core';
import { Delivery } from '../../../../models/delivery.model';
import { DeliveriesService } from '../../../../services/deliveries/deliveries.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { CustomDateFormatterPipe } from '../../../../utils/date-format/custom-date-formatter.pipe';
import { CommonModule } from '@angular/common';
import { NestingLoadedDeliveriesService } from '../../../../services/nesting-loaded-deliveries/nesting-loaded-deliveries.service';
import { NestingLoadedDeliveries } from '../../../../models/nesting-loaded-deliveries.model';

@Component({
  selector: 'app-add-delivery-to-nesting',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    CommonModule,
    CustomDateFormatterPipe
  ],
  templateUrl: './add-delivery-to-nesting.component.html',
  styleUrl: './add-delivery-to-nesting.component.css'
})
export class AddDeliveryToNestingComponent implements OnInit{

  deliveries: Delivery[] | null = null;

  private existingNLD: NestingLoadedDeliveries[] | null = null;

  constructor(
    private dialogRefParent: MatDialogRef<AddDeliveryToNestingComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      nestingId: string
    },
    private deliveriesService: DeliveriesService,
    private nldService: NestingLoadedDeliveriesService
  ){}

  ngOnInit(): void {
    this.deliveriesService.getAllLeftOverDeliveries().subscribe(result => {
      if (result) {
        this.deliveries = result;
      }
    });
    this.nldService.getAllNestingLoadedDeliveriesByNestingId(this.data.nestingId).subscribe(result => {
      if (result) {
        this.existingNLD = result;
      }
    })
  }

  addDeliveryToNesting(delivery: Delivery) {
    const tmp = this.existingNLD?.find(nld => nld.delivery.id === delivery.id);
    if (!tmp) {
      this.nldService.postNestingLoadedDelivery({nestingId: this.data.nestingId, deliveryId: delivery.id, quantity: 0}).subscribe(
        result => {
          if (result) {
            this.dialogRefParent.close(true);
          }
        }
      );
    }
  }

  onClose() {
    this.dialogRefParent.close(null);
  }

}
