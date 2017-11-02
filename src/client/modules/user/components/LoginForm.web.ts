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

// import React from 'react';
// import PropTypes from 'prop-types';
// import { Field, reduxForm } from 'redux-form';
// import url from 'url';
// import { Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';
// import settings from '../../../../../settings';
//
// const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
// let serverPort = process.env.PORT || port;
// if (__DEV__) {
//   serverPort = '3000';
// }
//
// const required = value => (value ? undefined : 'Required');
//
// const renderField = ({ input, label, type, meta: { touched, error } }) => {
//   let color = 'normal';
//   if (touched && error) {
//     color = 'danger';
//   }
//
//   return (
//     <FormGroup color={color}>
//       <Label>{label}</Label>
//       <div>
//         <Input {...input} placeholder={label} type={type} />
//         {touched && (error && <FormFeedback>{error}</FormFeedback>)}
//       </div>
//     </FormGroup>
//   );
// };
//
// renderField.propTypes = {
//   input: PropTypes.object,
//   label: PropTypes.string,
//   type: PropTypes.string,
//   meta: PropTypes.object
// };
//
// const facebookLogin = () => {
//   window.location = `${protocol}//${hostname}:${serverPort}/auth/facebook`;
// };
//
// const LoginForm = ({ handleSubmit, submitting, onSubmit, errors }) => {
//   return (
//     <Form name="login" onSubmit={handleSubmit(onSubmit)}>
//       <Field name="email" component={renderField} type="email" label="Email" validate={required} />
//       <Field name="password" component={renderField} type="password" label="Password" validate={required} />
//       {errors && (
//         <FormGroup color="danger">
//           <FormFeedback>{errors.map(error => <li key={error.field}>{error.message}</li>)}</FormFeedback>
//         </FormGroup>
//       )}
//       <Button color="primary" type="submit" disabled={submitting}>
//         Login
//       </Button>
//       {settings.user.auth.facebook.enabled && (
//         <Button color="primary" type="button" onClick={facebookLogin} style={{ marginLeft: 10 }}>
//           Login with Facebook
//         </Button>
//       )}
//     </Form>
//   );
// };
//
// LoginForm.propTypes = {
//   handleSubmit: PropTypes.func,
//   onSubmit: PropTypes.func,
//   submitting: PropTypes.bool,
//   errors: PropTypes.array
// };
//
// export default reduxForm({
//   form: 'login'
// })(LoginForm);
