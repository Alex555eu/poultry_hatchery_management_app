import { Component, EventEmitter, Output } from '@angular/core';
import { HatchingIncubatorService } from '../../../../services/hatching-incubator/hatching-incubator.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PostIncubatorRequest } from '../../../../dto/post-incubator-request';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-create-hatching-incubator-panel',
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
    MatSnackBarModule
  ],
  templateUrl: './create-hatching-incubator-panel.component.html',
  styleUrl: './create-hatching-incubator-panel.component.css'
})
export class CreateHatchingIncubatorPanelComponent {
  @Output() 
  closePanelEvent = new EventEmitter();

  dataForm: FormGroup;
  outputTiles: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private nestingIncubatorService: HatchingIncubatorService,
    private snackBar: MatSnackBar
  ) {
      this.dataForm = this.formBuilder.group({
        humanReadableId: ['', Validators.required],
        maxCapacity: [8, Validators.required],
        numberOfColumns: [4, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.reloadIncubatorLayout();
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
    this.closePanelEvent.emit();
  }

  reloadIncubatorLayout() {
    const maxCapacity = this.dataForm.get('maxCapacity')?.value ?? 0;
    const numberOfColumns = this.dataForm.get('numberOfColumns')?.value ?? 0;
    this.outputTiles = this.prepareDataForPrinting(this.makeDataVisualisation(maxCapacity), numberOfColumns);
  }

  private prepareDataForPrinting(array: string[], cols: number): string[] {
    let result = Array();
    for(let i = 0, x = 0; i < array.length; i++, x++) {
      if (i === x && x === cols/2) {
        result.push('');
        x=0;
      }
      if (i > x && x === cols) { 
        result.push('');
        x=0;
      }
      result.push(array.at(i));
    }
    return result;
  }

  private makeDataVisualisation(amount: number): string[] {
    let result = new Array();
    for(let i = 0; i < amount; i++) {
      result.push('S' + (i+1));
    }
    return result;
  }
}
