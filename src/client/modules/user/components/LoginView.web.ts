import { Component } from '@angular/core';
import LoginService from '../containers/Login';

import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import * as url from 'url';
import settings from '../../../../../settings';
import { FormInput } from '../../ui-bootstrap/components/Form';
import { ItemType } from '../../ui-bootstrap/components/FormItem';
import { LoginFormData, LoginFormState, ResetLoginFormAction } from '../reducers';

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

      <ausk-form [onSubmit]="onSubmit"
                 [formName]="'loginForm'"
                 [formState]="formState"
                 [form]="form"
                 [btnName]="'Login'">
      </ausk-form>

      <button id="fb-login-btn" *ngIf="settings.user.auth.facebook.enabled" class="btn btn-primary" (click)="facebookLogin()" )>
        Login with Facebook
      </button>

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
  public formState: FormGroupState<LoginFormData>;
  public form: FormInput[];
  public facebookLogin: any;
  public settings: any;

  constructor(private loginService: LoginService, private router: Router, private store: Store<LoginFormState>) {
    this.form = this.createForm();
    store.select(s => s.loginForm).subscribe((res: any) => {
      this.formState = res;
    });
    this.settings = settings;
    this.facebookLogin = this.facebookLoginFn;
  }

  public onSubmit = (loginInputs: any) => {
    const { email, password } = loginInputs;
    this.loginService.login(email, password, ({ data: { login: { errors, tokens } } }: any) => {
      if (errors) {
        this.errors = errors;
        return;
      }

      const { token, refreshToken } = tokens;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      this.store.dispatch(new ResetLoginFormAction());
      this.router.navigateByUrl('profile');
    });
  };

  private facebookLoginFn = () => {
    const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
    const serverPort = __DEV__ ? '3000' : process.env.PORT || port;
    window.location.href = `${protocol}//${hostname}:${serverPort}/auth/facebook`;
  };

  private createForm = (): FormInput[] => {
    return [
      {
        id: 'email-input',
        name: 'email',
        value: 'Email',
        type: 'email',
        placeholder: 'Email',
        inputType: ItemType.INPUT
      },
      {
        id: 'password-input',
        name: 'password',
        value: 'Password',
        type: 'password',
        placeholder: 'Password',
        inputType: ItemType.INPUT
      }
    ];
  };
}
