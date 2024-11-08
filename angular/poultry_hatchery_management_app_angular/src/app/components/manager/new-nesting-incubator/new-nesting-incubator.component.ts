import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NestingIncubatorService } from '../../../services/nesting-incubator/nesting-incubator.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IncubatorPrinterService } from '../../../utils/incubator-printer/incubator-printer.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PostIncubatorRequest } from '../../../dto/post-incubator-request';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-new-nesting-incubator',
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
  templateUrl: './new-nesting-incubator.component.html',
  styleUrl: './new-nesting-incubator.component.css'
})
export class NewNestingIncubatorComponent {

  dataForm: FormGroup;
  outputTiles: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private nestingIncubatorService: NestingIncubatorService,
    private snackBar: MatSnackBar,
    private incubatorPrinterService: IncubatorPrinterService,
    private dialogRefParent: MatDialogRef<NewNestingIncubatorComponent>
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
    this.outputTiles = this.incubatorPrinterService.getIncubatorLayout(maxCapacity, numberOfColumns);
  }

  onSubmit() {
    if (this.dataForm.valid) {
      let body: PostIncubatorRequest = {
        humanReadableId: this.dataForm.get('humanReadableId')?.value,
        maxCapacity: this.dataForm.get('maxCapacity')?.value,
        numberOfColumns: this.dataForm.get('numberOfColumns')?.value
      }
      this.nestingIncubatorService.postNestingIncubator(body).subscribe({
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
