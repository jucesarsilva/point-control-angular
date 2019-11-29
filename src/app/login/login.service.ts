import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginResponse } from './login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  login(login: string, password: string) : Observable<LoginResponse> {
    let url = this.baseUrl + '/auth/login';
    return this.http.post<LoginResponse>(url, {
      login: login,
      password: password
    });
  }
}
