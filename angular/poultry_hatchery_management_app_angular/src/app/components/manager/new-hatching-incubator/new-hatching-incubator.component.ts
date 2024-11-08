import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { HatchingIncubatorService } from '../../../services/hatching-incubator/hatching-incubator.service';
import { IncubatorPrinterService } from '../../../utils/incubator-printer/incubator-printer.service';
import { PostIncubatorRequest } from '../../../dto/post-incubator-request';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-hatching-incubator',
  standalone: true,
  imports: [
    MatIcon,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatSelectModule,
    MatStepperModule,
    FormsModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './new-hatching-incubator.component.html',
  styleUrl: './new-hatching-incubator.component.css'
})
export class NewHatchingIncubatorComponent {

  dataForm: FormGroup;
  outputTiles: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private nestingIncubatorService: HatchingIncubatorService,
    private snackBar: MatSnackBar,
    private incPrint: IncubatorPrinterService,
    private dialogRefParent: MatDialogRef<NewHatchingIncubatorComponent>
  ) {
      this.dataForm = this.formBuilder.group({
        humanReadableId: ['', Validators.required],
        maxCapacity: [8, Validators.required],
        numberOfColumns: [4, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    const maxCapacity = this.dataForm.get('maxCapacity')?.value ?? 0;
    const numberOfColumns = this.dataForm.get('numberOfColumns')?.value ?? 0;
    this.outputTiles = this.incPrint.getIncubatorLayout(maxCapacity, numberOfColumns);
  }

  onSubmit() {
    if (this.dataForm.valid) {
      let body: PostIncubatorRequest = {
        humanReadableId: this.dataForm.get('humanReadableId')?.value,
        maxCapacity: this.dataForm.get('maxCapacity')?.value,
        numberOfColumns: this.dataForm.get('numberOfColumns')?.value
      }
      this.nestingIncubatorService.postHatchingIncubator(body).subscribe({
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
