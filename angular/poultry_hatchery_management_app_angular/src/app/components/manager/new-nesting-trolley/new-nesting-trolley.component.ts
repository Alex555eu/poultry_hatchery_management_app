import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NestingTrolleyService } from '../../../services/nesting-trolley/nesting-trolley.service';
import { PostTrolleyRequest } from '../../../dto/post-trolley-request';

@Component({
  selector: 'app-new-nesting-trolley',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './new-nesting-trolley.component.html',
  styleUrl: './new-nesting-trolley.component.css'
})
export class NewNestingTrolleyComponent {

  dataForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private nestingTrolleySerice: NestingTrolleyService,
    private snackBar: MatSnackBar,
    private dialogRefParent: MatDialogRef<NewNestingTrolleyComponent>
  ) {
      this.dataForm = this.formBuilder.group({
        humanReadableId: ['', Validators.required],
        maxCapacity: [1, Validators.required],
    });
  }

  onSubmit() {
    if (this.dataForm.valid) {
      let body: PostTrolleyRequest = {
        humanReadableId: this.dataForm.get('humanReadableId')?.value,
        maxCapacity: this.dataForm.get('maxCapacity')?.value
      }
      this.nestingTrolleySerice.postNestingTrolley(body).subscribe({
        next: (response) => {
          this.onClose();
        },
        error: (error: any) => {
          this.snackBar.open('Coś poszło nie tak', 'Zamknij', {
            duration: 5000, // millis
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  onClose() {
    this.dialogRefParent.close();
  }

}
