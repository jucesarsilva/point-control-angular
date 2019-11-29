import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DaysService } from './days.service';
import { DaysResponse } from './days.model';
import { addDays, differenceInDays  } from 'date-fns';


@Component({
  selector: 'days',
  templateUrl: './days.component.html',
  styleUrls: ['./days.component.scss']
})
export class DaysComponent implements OnInit {
  public dataSource: MatTableDataSource<DaysResponse>;
  public displayedColumns: string[] = ['day'];
  public form: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private datepipe: DatePipe,
    private router: Router,
    private DaysService: DaysService,
    private snackBar: MatSnackBar
  ) {
    this.form = formBuilder.group({
      startDate: new Date(),
      endDate: new Date()
    });
  }

  ngOnInit(): void {
    this.search();
  }

  search(): void{
    if (this.form.value.startDate && this.form.value.endDate) {
      let startDate = this.datepipe.transform(this.form.value.startDate, 'yyyy-MM-dd');
      let endDate = this.datepipe.transform(this.form.value.endDate, 'yyyy-MM-dd');
      this.DaysService.getDays(startDate, endDate).subscribe(
        data => {
          let dates = this.getDatesByFilter(this.form.value.endDate, this.form.value.startDate);
          let period = dates.map(date => {
            let formatedDay = this.datepipe.transform(date, 'yyyy-MM-dd');
            let day = data.find(d => d.date === formatedDay);
            if (!day) {
              day = new DaysResponse();
              day.date = formatedDay;
            }
            return day;
          }).reverse();
          this.dataSource = new MatTableDataSource<DaysResponse>(period);
        },
        () => {
          this.snackBar.open('Erro na busca por dias', "Fechar", {
            duration: 5000,
            panelClass: ['snack-bar-error']
          });
        }
      );
    }
  }

  getDatesByFilter(endDate, startDate) {
    const days = differenceInDays(endDate, startDate);
    return [...Array(days+1).keys()].map((i) => addDays(startDate, i));
  }

  goTo(day): void {
    this.router.navigate([`times/${day.date}`]);
  }
}
