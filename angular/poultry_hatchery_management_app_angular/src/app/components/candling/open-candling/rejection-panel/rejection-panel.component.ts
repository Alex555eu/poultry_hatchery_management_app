import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Rejection2 } from '../../../../models/rejection2.model';
import { RejectionService } from '../../../../services/rejections/rejection.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostRejection2Request } from '../../../../dto/post-rejection2-request';
import { NestingTrolleyContent } from '../../../../models/nesting-trolley-content.model';
import { BehaviorSubject, tap, Subscription, take, switchMap, of, takeLast } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { CandlingNestingTrolleyAssignment } from '../../../../models/candling-nesting-trolley-assignment.model';
import { NestingLoadedDeliveries } from '../../../../models/nesting-loaded-deliveries.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-rejection-panel',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule
  ],
  templateUrl: './rejection-panel.component.html',
  styleUrl: './rejection-panel.component.css'
})
export class RejectionPanelComponent implements OnChanges, OnInit {

  @ViewChild('scrollMe') scrollMe!: ElementRef;

  @Input() delivery: NestingLoadedDeliveries | null = null;
  @Input() assignment: CandlingNestingTrolleyAssignment[] | null = null;
  @Input() rejectionCause: string = 'default';
  @Output() refresh = new EventEmitter<boolean>();


  private rejectionsSubject = new BehaviorSubject<Rejection2[]>([]);
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
    if (this.delivery && this.rejectionCause && this.assignment && this.assignment.length > 0) {
      this.rejectionService.getAllRejection2(this.assignment[0].candling.id)
        .subscribe(response => {
          if (response){
            let filteredRejections = response.filter(it => it.nestingLoadedDeliveries.id === this.delivery?.id && it.cause === this.rejectionCause);
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
      this.rejectionService.postRejection2(body)
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
    this.rejectionService.deleteRejection2(rejectionId)
      .subscribe({
        next: () => {
          this.ngOnInit();
          this.emit();
        },
        error: (err) => {
          this.snackBar.open('Brak miejsca na wózku', 'Zamknij', {
            duration: 5000, // millis
            horizontalPosition: 'center',
            verticalPosition: 'top'
          })
        }
      });
  }
  


  emit() {
    this.refresh.emit(true);
  }


  highlight(rejectionId: string) {
    this.selectedRejectionId = this.selectedRejectionId === rejectionId ? '' : rejectionId;
  }


  private getRequestBody(): PostRejection2Request | null {
    if (this.inputValue && !isNaN(+this.inputValue) && this.delivery && this.assignment) {
      return {
        candlingNestingTrolleyAssignmentId: this.assignment[0].id,
        nestingLoadedDeliveryId: this.delivery.id,
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





