import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NestingService } from './../../../services/nesting/nesting.service';
import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-nesting',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './new-nesting.component.html',
  styleUrl: './new-nesting.component.css'
})
export class NewNestingComponent {

  title = '';
  description = '';

  constructor(
    private nestingService: NestingService,
    private snackBar: MatSnackBar,
    private dialogRefParent: MatDialogRef<NewNestingComponent>
  ){}


  onSubmit(form: any) {
    if (form.valid) {
      this.nestingService.postNewNesting(this.title, this.description).subscribe(response => {
        if (response) {
          this.onClose(true);
        } else {
          this.snackBar.open('Oops, cośposzło nie tak', 'Zamknij', {
            duration: 5000, // millis
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  onClose(outcome: any) {
    this.dialogRefParent.close(outcome);
  }

}
