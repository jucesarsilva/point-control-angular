import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public login = new FormControl('', [Validators.required]);
  public password = new FormControl('', [Validators.required]);
  public error: boolean = false;
  public visibility: boolean = false;

  constructor(
    private LoginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
  }

  getErrorMessage(field) {
    return this[field].hasError('required') ? 'O preenchimento é obrigatório' : '';
  }

  onLogin() {
    this.LoginService.login(this.login.value, this.password.value).subscribe(
      data => {
        sessionStorage.setItem('auth', JSON.stringify(data));
        this.router.navigate(['/']);
      },
      dataError => {
        this.error = true;
      }
    );
  }
}
