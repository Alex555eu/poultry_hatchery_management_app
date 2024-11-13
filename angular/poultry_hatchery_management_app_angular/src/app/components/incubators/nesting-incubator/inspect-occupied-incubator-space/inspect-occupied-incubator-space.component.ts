import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NestingTrolleyContent } from '../../../../models/nesting-trolley-content.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-inspect-occupied-incubator-space',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './inspect-occupied-incubator-space.component.html',
  styleUrl: './inspect-occupied-incubator-space.component.css'
})
export class InspectOccupiedIncubatorSpaceComponent {

  constructor(
    private dialogRefParent: MatDialogRef<InspectOccupiedIncubatorSpaceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      trolleyContent: NestingTrolleyContent[]
    }
  ){}

  onPermanentLeave() {
    this.dialogRefParent.close('PERMANENT');
  }

  onTemporaryLeave() {
    this.dialogRefParent.close('TEMPORARY');
  }

}
