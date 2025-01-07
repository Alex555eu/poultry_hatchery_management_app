import { Component, Inject, OnInit } from '@angular/core';
import { Nesting } from '../../../models/nesting.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RejectionService } from '../../../services/rejections/rejection.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { response } from 'express';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unexpected-rejection',
  standalone: true,
  imports: [
    MatDialogModule,  // do MatDialog
    MatFormFieldModule,  // do form-field
    MatInputModule,  // do input
    MatSelectModule,  // do select
    MatButtonModule,  // do button
    MatIconModule,  // do icon
    FormsModule,
    CommonModule
  ],
  templateUrl: './unexpected-rejection.component.html',
  styleUrl: './unexpected-rejection.component.css'
})
export class UnexpectedRejectionComponent implements OnInit {

  nesting: Nesting | null = null;
  quantity: number = 0;

  causes: string[] = [];
  selectedCause = '';

  constructor(
    private dialogRefParent: MatDialogRef<UnexpectedRejectionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      nesting: Nesting
    },
    private rejectionService: RejectionService
  ){}

  ngOnInit(): void {
    if (this.data) {
      this.nesting = this.data.nesting;
      this.rejectionService.getAllRejectionCauses().subscribe(response => {
        if (response) {
          this.causes = response;
        }
      })
    }
  }

  execute() {
    this.rejectionService.postRejectionUnexpected({
      nestingId: this.nesting!.id,
      quantity: this.quantity,
      cause: this.selectedCause
    }).subscribe(() => {
      this.onClose();
    });
  }

  onClose() {
    this.dialogRefParent.close();
  }

}
