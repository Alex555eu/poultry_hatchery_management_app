import { PostNestingIncubatorRequest } from './../../../dto/post-nesting-incubator-request';
import { Component, Output, Input, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {MatGridListModule} from '@angular/material/grid-list';
import { NestingIncubatorService } from '../../../services/nesting-incubator/nesting-incubator.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modify-nesting-incubator-panel',
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
  templateUrl: './modify-nesting-incubator-panel.component.html',
  styleUrl: './modify-nesting-incubator-panel.component.css'
})
export class ModifyNestingIncubatorPanelComponent { 

  @Output() 
  closePanelEvent = new EventEmitter();

  dataForm: FormGroup;
  outputTiles: string[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private nestingIncubatorService: NestingIncubatorService,
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
      let body: PostNestingIncubatorRequest = {
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
