import { Component, Input } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';
import * as url from 'url';
import settings from '../../../../../settings';
import { LoginFormData } from '../reducers';

interface FormInput {
  id: string;
  name: string;
  value: string;
  type: string;
  placeholder: string;
}

@Component({
  selector: 'login-form',
  template: `
    <form novalidate name="login" (ngSubmit)="onSubmit(formState.loginForm.value)" [ngrxFormState]="formState">
      <div class="form-group" *ngFor="let fi of formInputs">
        <label for="{{fi.id}}">{{fi.value}}</label>
        <input id="{{fi.id}}"
               [ngrxFormControlState]="formState.loginForm.controls[fi.name]"
               type="{{fi.type}}"
               class="form-control"
               placeholder="{{fi.value}}"
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

  public facebookLogin: any;
  public settings: any;
  public formInputs: FormInput[];
  public login: any = {};
  public emailPattern: any = '^[a-zA-Z0–9_.+-]+@[a-zA-Z0–9-]+\\.[a-zA-Z0–9.]+$';

  constructor() {
    this.settings = settings;
    this.facebookLogin = this.facebookLoginFn;
    this.formInputs = this.getForm();
  }

  private facebookLoginFn = () => {
    const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
    const serverPort = __DEV__ ? '3000' : process.env.PORT || port;
    window.location.href = `${protocol}//${hostname}:${serverPort}/auth/facebook`;
  };

  private getForm = (): FormInput[] => {
    return [
      { id: 'email-input', name: 'email', value: 'Email', type: 'email', placeholder: 'Email' },
      { id: 'password-input', name: 'password', value: 'Password', type: 'password', placeholder: 'Password' }
    ];
  };
}
