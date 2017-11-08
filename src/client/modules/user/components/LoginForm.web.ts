import { Component, Input } from '@angular/core';
import * as url from 'url';
import settings from '../../../../../settings';

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
    <form name="login" #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm.form.value)">
      <div class="form-group" *ngFor="let fi of formInputs">
        <label for="{{fi.id}}">{{fi.value}}</label>
        <input id="{{fi.id}}"
               type="{{fi.type}}"
               class="form-control"
               placeholder="{{fi.value}}"
               name="{{fi.name}}"
               [(ngModel)]="login[fi.name]"
               #name="ngModel"
               pattern="{{(fi.name === 'email' ? emailPattern : null)}}"
               required />

        <div *ngIf="name.invalid && (name.dirty || name.touched)">
          <small [hidden]="!name.errors.required">
            {{fi.value}} is required.
          </small>
          <small *ngIf="name.errors.pattern">
            Email should be like john@doe.com
          </small>
        </div>

      </div>
      <button type="submit" id="login-submit-btn" class="btn btn-primary" [disabled]="!loginForm.form.valid">Login</button>
      <button id="fb-login-btn" *ngIf="settings.user.auth.facebook.enabled" class="btn btn-primary" (click)="facebookLogin()" )>
        Login with Facebook
      </button>
    </form>
  `,
  styles: ['button#fb-login-btn {margin-left: 10px}', 'small {color: brown}']
})
export default class LoginForm {
  @Input() public onSubmit: any;

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
