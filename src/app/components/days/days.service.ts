import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DaysResponse } from './days.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DaysService {

  constructor(private http: HttpClient) { }

  getDayByDate(date: string) : Observable<DaysResponse> {
    return this.http.get<DaysResponse>(`${environment.baseUrl}/day/date/${date}`);
  }

  getDays(startDate: string, endDate: string) : Observable<Array<DaysResponse>> {
    return this.http.get<Array<DaysResponse>>(`${environment.baseUrl}/days/${startDate}/${endDate}`);
  }
}
