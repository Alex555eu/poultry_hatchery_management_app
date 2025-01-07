import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HatchingLoadedDeliveries } from '../../../../models/hatching-loaded-deliveries.model';
import { BehaviorSubject } from 'rxjs';
import { Rejection3 } from '../../../../models/rejection3.model';
import { RejectionService } from '../../../../services/rejections/rejection.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rejection3-panel',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule
  ],
  templateUrl: './rejection3-panel.component.html',
  styleUrl: './rejection3-panel.component.css'
})
export class Rejection3PanelComponent implements OnChanges, OnInit {

  @ViewChild('scrollMe') scrollMe!: ElementRef;

  @Input() hld: HatchingLoadedDeliveries | null = null;
  @Input() rejectionCause: string = 'default';
  @Output() refresh = new EventEmitter<boolean>();

  private rejectionsSubject = new BehaviorSubject<Rejection3[]>([]);
  rejections$ = this.rejectionsSubject.asObservable();

  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable();

  selectedRejectionId = '';
  inputValue: string | null = null;

  constructor(
    private rejectionService: RejectionService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    if (this.hld && this.rejectionCause) {
      this.rejectionService.getAllRejection3(this.hld.hatching.id)
        .subscribe(response => {
          if (response){
            let filteredRejections = response.filter(it => { 
              return it.hatchingLoadedDeliveries.id === this.hld?.id && 
                      it.cause === this.rejectionCause
                    });
            let total = filteredRejections.reduce((sum, item) => sum + item.quantity, 0);

            this.rejectionsSubject.next(filteredRejections);
            this.totalSubject.next(total);

            this.scrollToBottom();
        }
        });
    }
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }

  reject() {
    const body = this.getRequestBody();
    if (body) {
      this.rejectionService.postRejection3(body)
        .subscribe( response => {
          if (response) {
            this.inputValue = '';
            this.ngOnInit();
            this.emit();
          }
        });
    }
  }

  cancelRejection(rejectionId: string) {
    this.rejectionService.deleteRejection3(rejectionId)
      .subscribe({
        next: () => {
          this.ngOnInit();
          this.emit();
        }
      });
  }
    
  emit() {
    this.refresh.emit(true);
  }


  highlight(rejectionId: string) {
    this.selectedRejectionId = this.selectedRejectionId === rejectionId ? '' : rejectionId;
  }

  private getRequestBody() {
    if (this.inputValue && !isNaN(+this.inputValue)) {
      return {
        hatchingLoadedDeliveryId: this.hld!.id,
        cause: this.rejectionCause,
        quantity: +this.inputValue,
      };
    }
    return null;
  }

  scrollToBottom() {
    try {
      this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;
    } catch (err) {}
  }

}
