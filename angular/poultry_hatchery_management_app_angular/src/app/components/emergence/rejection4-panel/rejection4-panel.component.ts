import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { HatchingResult } from '../../../models/hatching-result.model';
import { BehaviorSubject } from 'rxjs';
import { Rejection4 } from '../../../models/rejection4.model';
import { RejectionService } from '../../../services/rejections/rejection.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rejection4-panel',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule    
  ],
  templateUrl: './rejection4-panel.component.html',
  styleUrl: './rejection4-panel.component.css'
})
export class Rejection4PanelComponent implements OnInit, OnChanges {

  @ViewChild('scrollMe') scrollMe!: ElementRef;

  @Input() hatchingResult: HatchingResult | null = null;
  @Input() rejectionCause: string = 'default';
  @Output() refresh = new EventEmitter<boolean>();

  private rejectionsSubject = new BehaviorSubject<Rejection4[]>([]);
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
    if (this.hatchingResult && this.rejectionCause) {
      this.rejectionService.getAllRejection4(this.hatchingResult.hatchingLoadedDeliveries.hatching.nesting.id)
        .subscribe(response => {
          if (response){
            let filteredRejections = response.filter(it => { 
              return it.hatchingResult.id === this.hatchingResult?.id && 
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
    console.log('called 1')
    const body = this.getRequestBody();
    if (body) {
      console.log('called 2')
      this.rejectionService.postRejection4(body)
        .subscribe( response => {
          console.log('called 3')
          if (response) {
            console.log('called 4')
            this.inputValue = '';
            this.ngOnInit();
            console.log('called 5')
            this.emit();
          }
        });
    }
  }

  cancelRejection(rejectionId: string) {
    this.rejectionService.deleteRejection4(rejectionId)
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
        hatchingResultId: this.hatchingResult!.id,
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

