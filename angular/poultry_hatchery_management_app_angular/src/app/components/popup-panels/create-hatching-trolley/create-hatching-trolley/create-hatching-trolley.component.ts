import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PostTrolleyRequest } from '../../../../dto/post-trolley-request';
import e from 'express';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { HatchingTrolleyService } from '../../../../services/hatching-trolley/hatching-trolley.service';

@Component({
  selector: 'app-create-hatching-trolley',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './create-hatching-trolley.component.html',
  styleUrl: './create-hatching-trolley.component.css'
})
export class CreateHatchingTrolleyComponent {

  @Output() 
  closePanelEvent = new EventEmitter();

  dataForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private hatchingTrolleyService: HatchingTrolleyService,
    private snackBar: MatSnackBar
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
    this.closePanelEvent.emit();
  }

}


