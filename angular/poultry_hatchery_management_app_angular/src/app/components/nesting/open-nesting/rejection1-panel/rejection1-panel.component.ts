import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { NestingLoadedDeliveries } from '../../../../models/nesting-loaded-deliveries.model';
import { BehaviorSubject } from 'rxjs';
import { Rejection1 } from '../../../../models/rejection1.model';
import { RejectionService } from '../../../../services/rejections/rejection.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostRejection1Request } from '../../../../dto/post-rejection1-request';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-rejection1-panel',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule
  ],
  templateUrl: './rejection1-panel.component.html',
  styleUrl: './rejection1-panel.component.css'
})
export class Rejection1PanelComponent implements OnChanges, OnInit {

  @ViewChild('scrollMe') scrollMe!: ElementRef;

  @Input() nld: NestingLoadedDeliveries | null = null;
  @Input() rejectionCause: string = 'default';
  @Output() refresh = new EventEmitter<boolean>();


  private rejectionsSubject = new BehaviorSubject<Rejection1[]>([]);
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
    if (this.nld && this.rejectionCause) {
      this.rejectionService.getAllRejection1(this.nld.nesting.id)
        .subscribe(response => {
          if (response){
            let filteredRejections = response.filter(it => { 
              return it.nestingLoadedDeliveries.id === this.nld?.id && 
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
        this.rejectionService.postRejection1(body)
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
      this.rejectionService.deleteRejection1(rejectionId)
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
      if (this.inputValue && !isNaN(+this.inputValue) && this.nld?.id) {
        return {
          nestingLoadedDeliveriesId: this.nld.id,
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
