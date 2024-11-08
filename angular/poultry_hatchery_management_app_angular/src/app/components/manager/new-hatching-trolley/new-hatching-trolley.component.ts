import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HatchingTrolleyService } from '../../../services/hatching-trolley/hatching-trolley.service';
import { PostTrolleyRequest } from '../../../dto/post-trolley-request';

@Component({
  selector: 'app-new-hatching-trolley',
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
  templateUrl: './new-hatching-trolley.component.html',
  styleUrl: './new-hatching-trolley.component.css'
})
export class NewHatchingTrolleyComponent {

  dataForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private hatchingTrolleyService: HatchingTrolleyService,
    private snackBar: MatSnackBar,
    private dialogRefParent: MatDialogRef<NewHatchingTrolleyComponent>
  ) {
      this.dataForm = this.formBuilder.group({
        humanReadableId: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.dataForm.valid) {
      let body: PostTrolleyRequest = {
        humanReadableId: this.dataForm.get('humanReadableId')?.value,
        maxCapacity: -1
      }
      this.hatchingTrolleyService.postHatchingTrolley(body).subscribe({
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
