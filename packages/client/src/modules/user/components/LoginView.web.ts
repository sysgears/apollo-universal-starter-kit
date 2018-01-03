import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Subject } from 'rxjs/Subject';

import * as url from 'url';
import settings from '../../../../settings';
import { AlertItem, createErrorAlert } from '../../common/components/Alert';
import { FormInput } from '../../ui-bootstrap/components/Form';
import { ItemType } from '../../ui-bootstrap/components/FormItem';
import LoginService from '../containers/Login';
import { LoginFormData, LoginFormState, ResetLoginFormAction } from '../reducers';

@Component({
  selector: 'login-view',
  template: `
    <layout-center>
      <h1 class="text-center">Sign In</h1>

      <alert [subject]="alertSubject"></alert>

      <ausk-form [onSubmit]="onSubmit"
                 [formName]="'loginForm'"
                 [formState]="formState"
                 [form]="form"
                 [btnName]="'Login'"
                 [btnAlign]="'center'">
      </ausk-form>

      <div class="text-center">
        <ausk-button *ngIf="settings.user.auth.facebook.enabled" (click)="facebookLogin()">
          Login with Facebook
        </ausk-button>
      </div>

      <ausk-link [to]="'/forgot-password'">Forgot your password?</ausk-link>
      <hr/>
      <div style="margin-bottom: 16px">
        <span style="line-height: 58px">Not registered yet?</span>
        <ausk-link [to]="'/register'" style="margin: 10px">
          <ausk-button>Sign Up</ausk-button>
        </ausk-link>
      </div>
      <ausk-card>
        <card-group>
          <card-title>Available logins:</card-title>
          <card-text>admin@example.com:admin</card-text>
          <card-text>user@example.com:user</card-text>
        </card-group>
      </ausk-card>
    </layout-center>
  `
})
export default class LoginView {
  public alertSubject: Subject<AlertItem> = new Subject<AlertItem>();
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
        errors.forEach((error: any) => this.alertSubject.next(createErrorAlert(error.message)));
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
