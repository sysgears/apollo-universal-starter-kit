import { Component } from '@angular/core';
import LoginService from '../containers/Login';

import { Router } from '@angular/router';

@Component({
  selector: 'login-view',
  template: `
    <div id="content" class="container">
      <h1>Login page!</h1>

      <div *ngIf="errors">
        <div *ngFor="let error of errors" class="alert alert-danger" role="alert" [id]="error.field">
          {{error.message}}
        </div>
      </div>

      <login-form [onSubmit]="onSubmit"></login-form>
      <a routerLink="/forgot-password">Forgot your password?</a>
      <hr/>
      <div class="card">
        <div class="card-block">
          <h4 class="card-title">Available logins:</h4>
          <p class="card-text">admin@example.com:admin</p>
          <p class="card-text">user@example.com:user</p>
        </div>
      </div>
    </div>
  `
})
export default class LoginView {
  public errors: any[];

  constructor(private loginService: LoginService, private router: Router) {}

  public onSubmit = (loginInputs: any) => {
    this.loginService.login(loginInputs.email, loginInputs.password, ({ data: { login: { errors, tokens } } }: any) => {
      if (errors) {
        this.errors = errors;
        return;
      }

      const { token, refreshToken } = tokens;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      this.router.navigateByUrl('profile');
    });
  };
}
