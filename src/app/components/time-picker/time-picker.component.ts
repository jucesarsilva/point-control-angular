import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITime, Utils } from './time.model';
import { MatDialog } from '@angular/material';
import { DialogTimePickerComponent } from 'src/app/components/time-picker/dialog-time-picker/dialog-time-picker.component';

@Component({
  selector: 'time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  @Input() label = 'Hour';
  @Input() appearance = 'legacy';
  @Input() userTime: ITime;
  @Input() color: string;
  @Input() revertLabel: string;
  @Input() submitLabel: string;
  @Input() index: number;
  @Input() required: boolean = false;
  @Output() change: EventEmitter<string> = new EventEmitter<string>();
  @Output() remove: EventEmitter<number> = new EventEmitter<number>();
  public timemask = [/\d/, /\d/, ':', /\d/, /\d/];
  public time: string = '';

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    if (!this.userTime) {
      this.config();
    }
    if (this.userTime.format === 12) {
      this.timemask = [/\d/, ':', /\d/, /\d/, ` ${this.userTime.meriden}`];
    }
    this.time = this.setTime();
    this.emitChange();
  }

  config() {
    this.userTime = {
      hour: 24,
      minute: 0,
      meriden: 'PM',
      format: 24
    };
  }

  setTime() {

    if (!this.userTime) {
      return '';
    }

    if (this.userTime.format === 12) {
      this.timemask = [/\d/, ':', /\d/, /\d/, ` ${this.userTime.meriden}`];
    }

    let hour = `${this.userTime.hour}`;
    if (this.userTime.hour === 24) {
      hour = '00';
    } else if (this.userTime.hour < 10) {
      hour = `0${hour}`
    }

    if (this.userTime.minute === 0) {
      return `${hour}:00`;
    } else if (this.userTime.minute < 10) {
      const tt = '0' + String(this.userTime.minute);
      return `${hour}:${tt}`;
    } else {
      return `${hour}:${this.userTime.minute}`;
    }
  }

  showPicker() {
    const dialogRef = this.dialog.open(DialogTimePickerComponent, {
      data: {
        time: {
          hour: this.userTime.hour,
          minute: this.userTime.minute,
          meriden: this.userTime.meriden,
          format: this.userTime.format
        },
        color: this.color,
        revertLabel: this.revertLabel,
        submitLabel: this.submitLabel
      }
    });

    dialogRef.afterClosed().subscribe((result: ITime | -1) => {
      if (result === undefined) {
        return;
      } else if (result !== -1) {
        this.userTime = result;
        this.time = this.setTime();
        this.emitChange();
      }
    });
    return false;
  }

  formatDataEvent() {
    return {
      hour: Utils.formatHour(this.userTime.format, this.userTime.hour),
      minute: Utils.formatMinute(this.userTime.minute),
      meriden: this.userTime.meriden,
      format: this.userTime.format,
      time: this.time
    };
  }

  onBlur() {
    const incomplete = this.time.match(/_/) !== null;
    const isRequired = (this.time.length === 0 && this.required);
    if (isRequired || incomplete) {
      this.config();
      this.time = this.setTime();
      this.emitChange();
      return;
    }
    const time_split = this.time.split(':');
    const hour = parseInt(time_split[0]);
    const minute = parseInt(time_split[1]);
    const maxHour = hour > this.userTime.format;
    const maxMinute = minute > 59;
    if(!maxHour && !maxMinute) {
      this.userTime.hour = String(hour);
      this.userTime.minute = String(minute);
    }
    if (maxHour || maxMinute) {
      this.config();
      this.time = this.setTime();
    }
    this.emitChange();
  }

  onRemove() {
    this.remove.emit(this.index);
  }

  private emitChange() {
    this.change.emit(this.time);
  }
}
