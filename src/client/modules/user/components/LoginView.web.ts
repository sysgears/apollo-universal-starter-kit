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
    <h1>Login page!</h1>

    <alert [data]="alerts"></alert>

    <ausk-form [onSubmit]="onSubmit"
               [formName]="'loginForm'"
               [formState]="formState"
               [form]="form"
               [btnName]="'Login'">
    </ausk-form>

    <button id="fb-login-btn" *ngIf="settings.user.auth.facebook.enabled" class="btn btn-primary"
            (click)="facebookLogin()" )>
      Login with Facebook
    </button>

    <ausk-link [to]="'/forgot-password'">Forgot your password?</ausk-link>
    <hr/>
    <ausk-card>
      <card-group>
        <card-title>Available logins:</card-title>
        <card-text>admin@example.com:admin</card-text>
        <card-text>user@example.com:user</card-text>
      </card-group>
    </ausk-card>
  `
})
export default class LoginView {
  public alerts: any[];
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
        for (const error of errors) {
          if (this.alerts.indexOf(error) < 0) {
            this.alerts.push(error);
          }
        }
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
        label: 'Email',
        placeholder: 'Email',
        inputType: ItemType.INPUT
      },
      {
        id: 'password-input',
        name: 'password',
        value: 'Password',
        type: 'password',
        label: 'Password',
        placeholder: 'Password',
        inputType: ItemType.INPUT
      }
    ];
  };
}
