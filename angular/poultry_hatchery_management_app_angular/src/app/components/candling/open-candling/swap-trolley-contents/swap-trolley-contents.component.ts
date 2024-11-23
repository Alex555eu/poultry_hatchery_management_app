import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CandlingNestingTrolleyAssignment } from '../../../../models/candling-nesting-trolley-assignment.model';
import { NestingTrolleyService } from '../../../../services/nesting-trolley/nesting-trolley.service';
import { NestingTrolleyContent } from '../../../../models/nesting-trolley-content.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostNestingTrolleyContentTransferRequest } from '../../../../dto/post-nesting-trolley-content-transfer-request';

@Component({
  selector: 'app-swap-trolley-contents',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatDividerModule,
    ReactiveFormsModule
  ],
  templateUrl: './swap-trolley-contents.component.html',
  styleUrl: './swap-trolley-contents.component.css'
})
export class SwapTrolleyContentsComponent implements OnInit {


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      selectedAssignment: CandlingNestingTrolleyAssignment,
      allAssignments: CandlingNestingTrolleyAssignment[],
      allTrolleyContents: Map<CandlingNestingTrolleyAssignment, NestingTrolleyContent[]>
    },
    private nestingTrolleyService: NestingTrolleyService,
    private dialogRefParent: MatDialogRef<SwapTrolleyContentsComponent>,
    private snackBar: MatSnackBar
  ){}

  
  selectedSource: CandlingNestingTrolleyAssignment | null = null;
  selectedTarget: CandlingNestingTrolleyAssignment | null = null;
  selectedContent: NestingTrolleyContent | null = null;
  requestedQuantity: number = 0;
 

  ngOnInit(): void {
    this.selectedSource = this.data.selectedAssignment;
  }


  selectContent(content: NestingTrolleyContent) {
    if (this.selectedContent?.id === content.id) {
      this.selectedContent = null;
    } else {
      this.selectedContent = content;
    }
  }


  submit() {
    if (this.selectedSource && this.selectedTarget) {
      if (this.requestedQuantity <= 0 || 
        this.requestedQuantity > (this.selectedTarget.nestingTrolley.maxCapacity - this.sumOccupiedSpace(this.selectedTarget)))
        {
          this.snackBar.open('Nieprawidłowa ilość', 'Zamknij', {
            duration: 5000, // millis
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          return;
        }
        this.nestingTrolleyService.postNestingTrolleyContentTransfer(this.getRequestBody()).subscribe(response => {
          if (response) {
            this.dialogRefParent.close(true);
          }
        })
    }
  }

  
  onClose() {
    this.dialogRefParent.close(null);
  }


  sumOccupiedSpace(assignment: CandlingNestingTrolleyAssignment | null): number {
    if (assignment){  
      return this.data.allTrolleyContents.get(assignment)?.reduce((sum, item) => sum + item.quantity, 0) || -1;
    }
    return -1;
  }


  private getRequestBody(): PostNestingTrolleyContentTransferRequest {
    return {
      sourceNestingTrolleyContentId: this.selectedContent?.id ?? '',
      targetNestingTrolleyId: this.selectedTarget?.nestingTrolley.id ?? '',
      quantity: this.requestedQuantity
    }
  }

}
