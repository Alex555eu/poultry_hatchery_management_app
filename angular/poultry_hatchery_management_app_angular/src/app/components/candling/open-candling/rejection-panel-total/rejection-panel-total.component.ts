import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Rejection2 } from '../../../../models/rejection2.model';
import { NestingTrolleyContent } from '../../../../models/nesting-trolley-content.model';
import { BehaviorSubject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rejection-panel-total',
  standalone: true,
  imports: [
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './rejection-panel-total.component.html',
  styleUrl: './rejection-panel-total.component.css'
})
export class RejectionPanelTotalComponent implements OnInit, OnChanges {

  @Input() rejectionsAll: Rejection2[] | null = [];
  @Input() contentAll: NestingTrolleyContent[] | null = [];
  @Input() rejectionCause: string | null = null;

  private quantityOfEggsAtTheBeginningOfCandling: number|null = null;
  private quantityOfRejectedEggs: number|null = null;

  private eggsTotalSubject = new BehaviorSubject<number>(0);
  eggsTotal$ = this.eggsTotalSubject.asObservable();

  private eggsRejectedSubject = new BehaviorSubject<number>(0);
  eggsRejected$ = this.eggsRejectedSubject.asObservable();

  private percentageSubject = new BehaviorSubject<number>(0);
  percentage$ = this.percentageSubject.asObservable();


  ngOnInit(): void {
    if (this.rejectionsAll){
      let filteredRejections = this.rejectionsAll;

      if (this.rejectionCause){
          filteredRejections = this.rejectionsAll.filter(it => it.cause === this.rejectionCause);
      }

      this.quantityOfRejectedEggs = filteredRejections.reduce((sum, item) => sum + item.quantity, 0);
      this.eggsRejectedSubject.next(this.quantityOfRejectedEggs);

      if (this.contentAll){
        const contentTotal = this.contentAll.reduce((sum, item) => sum + item.quantity, 0);
        const quantityOfRejectionsTotal = this.rejectionsAll.reduce((sum, item) => sum + item.quantity, 0);

        this.quantityOfEggsAtTheBeginningOfCandling = contentTotal + quantityOfRejectionsTotal;
        this.eggsTotalSubject.next(this.quantityOfEggsAtTheBeginningOfCandling);
      }

      if (this.quantityOfEggsAtTheBeginningOfCandling){
        const percentage = Math.floor((this.quantityOfRejectedEggs*100)/this.quantityOfEggsAtTheBeginningOfCandling);
        this.percentageSubject.next(percentage);
      }
    }
  }

  ngOnChanges(): void {
      this.ngOnInit();
  }
  

}
