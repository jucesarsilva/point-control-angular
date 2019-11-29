import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DaysService } from 'src/app/components/days/days.service';
import { DaysResponse } from 'src/app/components/days/days.model';
import { TimesService } from './times.service';

@Component({
  selector: 'app-times',
  templateUrl: './times.component.html',
  styleUrls: ['./times.component.scss']
})
export class TimesComponent implements OnInit {

  public codUser: Number;
  public date: string;
  public day: DaysResponse = {
    codDay: null,
    codUser: null,
    date: null,
    points: []
  };
  public saving: boolean = false;
  public removing: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private DaysService: DaysService,
    private TimesService: TimesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    let auth = JSON.parse(sessionStorage.getItem('auth'));
    this.codUser = auth ? auth.codUser : null;
    this.date = this.activatedRoute.snapshot.params['date'];
    if (this.date) this.getDayByDate();
    else this.onBack();
  }

  getDayByDate() {
    this.DaysService.getDayByDate(this.date).subscribe(
      data => {
        if (data) {
          this.day = data;
          this.day.points.forEach(point => {
            const time_split = point.time.split(':');
            const hour = parseInt(time_split[0]);
            const minute = parseInt(time_split[1]);
            point.userTime = {
              hour: hour,
              minute: minute,
              meriden: 'PM',
              format: 24
            };
          });
        } else {
          this.day = {
            codDay: null,
            codUser: this.codUser,
            date: this.date,
            points: []
          };
        }
      },
      () => {
        this.snackBar.open('Erro ao recuperar o dia', "Fechar", {
          duration: 5000,
          panelClass: ['snack-bar-error']
        });
      }
    );
  }

  onClear() {
    this.day.points = [];
  }

  onNew() {
    this.day.points.push({
      codPoint: null,
      codDay: this.day.codDay,
      time: null,
      userTime: {
        hour: 24,
        minute: 0,
        meriden: 'PM',
        format: 24
      }
    });
  }

  onChange(event, point) {
    point.time = event;
  }

  onRemove(index, point) {
    if (this.removing) return;
    this.removing = true;
    this.TimesService.remove(point).subscribe(
      data => {
        this.removing = false;
        this.snackBar.open('Horário removido com sucesso!', "Fechar", {
          duration: 5000,
          panelClass: ['snack-bar-success']
        });
        this.getDayByDate();
      },
      () => {
        this.removing = false;
        this.snackBar.open('Erro ao remover', "Fechar", {
          duration: 5000,
          panelClass: ['snack-bar-error']
        });
      }
    );

  }

  onSave() {
    if (this.saving) return;
    this.saving = true;
    const endpoint = this.day.codDay === null ? 'save' : 'update';
    this.TimesService[endpoint](this.day).subscribe(
      data => {
        this.saving = false;
        this.snackBar.open('Horários salvos com sucesso!', "Fechar", {
          duration: 5000,
          panelClass: ['snack-bar-success']
        });
        this.getDayByDate();
      },
      () => {
        this.saving = false;
        this.snackBar.open('Erro ao salvar horários.', "Fechar", {
          duration: 5000,
          panelClass: ['snack-bar-error']
        });
      }
    );
  }

  onBack() {
    this.location.back();
  }
}
