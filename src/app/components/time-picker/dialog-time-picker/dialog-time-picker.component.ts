import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { ITime } from '../time.model'

@Component({
  selector: 'dialog-time-picker',
  templateUrl: './dialog-time-picker.component.html',
  styleUrls: ['./dialog-time-picker.component.scss']
})
export class DialogTimePickerComponent {
  userTime: ITime;
  color: string;

  constructor(
    private dialogRef: MatDialogRef<DialogTimePickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogRef.disableClose = true;
    this.userTime = this.data.time;
    this.color = this.data.color;
  }

  public revert() {
    this.dialogRef.close(-1);
  }

  public submit() {
    this.dialogRef.close(this.userTime);
  }
}
