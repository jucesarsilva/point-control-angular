import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DaysResponse, Point } from 'src/app/components/days/days.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimesService {

  constructor(private http: HttpClient) { }

  save(day: DaysResponse) : Observable<DaysResponse> {
    return this.http.post<DaysResponse>(`${environment.baseUrl}/day/save`, day);
  }

  update(day: DaysResponse) : Observable<DaysResponse> {
    return this.http.post<DaysResponse>(`${environment.baseUrl}/day/update`, day);
  }

  remove(point: Point) : Observable<Point> {
    return this.http.post<Point>(`${environment.baseUrl}/point/delete`, point);
  }
}
