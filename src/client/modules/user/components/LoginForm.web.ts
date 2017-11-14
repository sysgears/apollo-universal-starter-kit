import { Component, Input } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';
import * as url from 'url';
import settings from '../../../../../settings';
import { LoginFormData } from '../reducers';
import { FormInput } from './UserEditView';

@Component({
  selector: 'login-form',
  template: `
    <form novalidate name="login" (ngSubmit)="onSubmit(formState.loginForm.value)" [ngrxFormState]="formState">
      <div class="form-group" *ngFor="let fi of form">
        <label for="{{fi.id}}">{{fi.value}}</label>
        <input id="{{fi.id}}"
               [ngrxFormControlState]="formState.loginForm.controls[fi.name]"
               type="{{fi.type}}"
               class="form-control"
               placeholder="{{fi.placeholder}}"
               name="{{fi.name}}"
               [(ngModel)]="formState.loginForm.value[fi.name]" />

        <div *ngIf="formState.loginForm.controls[fi.name].isInvalid && (formState.loginForm.controls[fi.name].isDirty || formState.loginForm.controls[fi.name].isTouched)">
          <small [hidden]="!formState.loginForm.controls[fi.name].errors[fi.name]">
            {{formState.loginForm.controls[fi.name].errors[fi.name]}}
          </small>
          <small [hidden]="!formState.loginForm.controls[fi.name].errors.required">
            {{fi.value}} is required
          </small>
        </div>

      </div>
      <button type="submit" id="login-submit-btn" class="btn btn-primary" [disabled]="formState.loginForm.isInvalid">Login</button>
      <button id="fb-login-btn" *ngIf="settings.user.auth.facebook.enabled" class="btn btn-primary" (click)="facebookLogin()" )>
        Login with Facebook
      </button>
    </form>
  `,
  styles: ['button#fb-login-btn {margin-left: 10px}', 'small {color: brown}']
})
export default class LoginForm {
  @Input() public onSubmit: any;
  @Input() public formState: FormGroupState<LoginFormData>;
  @Input() public form: FormInput[];

  public facebookLogin: any;
  public settings: any;
  public login: any = {};
  public emailPattern: any = '^[a-zA-Z0–9_.+-]+@[a-zA-Z0–9-]+\\.[a-zA-Z0–9.]+$';

  constructor() {
    this.settings = settings;
    this.facebookLogin = this.facebookLoginFn;
  }

  private facebookLoginFn = () => {
    const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
    const serverPort = __DEV__ ? '3000' : process.env.PORT || port;
    window.location.href = `${protocol}//${hostname}:${serverPort}/auth/facebook`;
  };
}
