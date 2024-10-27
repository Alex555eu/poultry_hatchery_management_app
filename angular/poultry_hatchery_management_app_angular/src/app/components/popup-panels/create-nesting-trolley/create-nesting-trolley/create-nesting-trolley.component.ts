import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NestingTrolleyService } from '../../../../services/nesting-trolley/nesting-trolley.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PostTrolleyRequest } from '../../../../dto/post-trolley-request';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-nesting-trolley',
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
  templateUrl: './create-nesting-trolley.component.html',
  styleUrl: './create-nesting-trolley.component.css'
})
export class CreateNestingTrolleyComponent {

  
  @Output() 
  closePanelEvent = new EventEmitter();

  dataForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private nestingTrolleySerice: NestingTrolleyService,
    private snackBar: MatSnackBar
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
    this.closePanelEvent.emit();
  }

}
