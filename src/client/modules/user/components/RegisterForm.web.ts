import { Component, Input } from '@angular/core';

interface FormInput {
  id: string;
  name: string;
  value: string;
  type: string;
  placeholder: string;
  minLength?: number;
}

@Component({
  selector: 'register-form',
  template: `
    <form name="login" #registerForm="ngForm" (ngSubmit)="onSubmit(registerForm.form.value)">
      <div class="form-group" *ngFor="let fi of formInputs">
        <label for="{{fi.id}}">{{fi.value}}</label>
        <input id="{{fi.id}}"
               type="{{fi.type}}"
               class="form-control"
               placeholder="{{fi.value}}"
               name="{{fi.name}}"
               [(ngModel)]="register[fi.name]"
               #name="ngModel"
               minlength="{{fi.minLength}}"
               pattern="{{pattern(fi.name)}}"
               required />

        <div *ngIf="name.invalid && (name.dirty || name.touched)">
          <small [hidden]="!name.errors.required">
            {{fi.value}} is required.
          </small>
          <small *ngIf="name.errors.minlength">
            Min length of the {{fi.value}} should be {{fi.minLength}}.
          </small>
          <small *ngIf="name.errors.pattern">
            {{patternMsg(fi.name)}}
          </small>
        </div>

      </div>
      <button type="submit" id="register-submit-btn" class="btn btn-primary" [disabled]="!registerForm.form.valid">Register</button>
    </form>
  `,
  styles: ['small {color: brown}']
})
export default class RegisterForm {
  @Input() public onSubmit: any;

  public formInputs: FormInput[];
  public register: any = {};
  public pattern: any;
  public patternMsg: any;

  constructor() {
    this.formInputs = this.getForm();
    this.pattern = this.getPattern;
    this.patternMsg = this.getPatternMsg;
  }

  private getPattern = (fieldName: string) => {
    let pat: any = null;

    if (fieldName === 'email') {
      pat = '^[a-zA-Z0–9_.+-]+@[a-zA-Z0–9-]+\\.[a-zA-Z0–9.]+$';
    }

    if (fieldName === 'passwordConfirmation') {
      pat = this.register.password || null;
    }

    return pat;
  };

  private getPatternMsg = (fieldName: string) => {
    let patMsg: string = null;

    if (fieldName === 'email') {
      patMsg = 'Email should be like john@doe.com';
    }

    if (fieldName === 'passwordConfirmation') {
      patMsg = 'Password confirmation should match to password';
    }

    return patMsg;
  };

  private getForm = (): FormInput[] => {
    return [
      {
        id: 'username-input',
        name: 'username',
        value: 'Username',
        type: 'text',
        placeholder: 'Username',
        minLength: 3
      },
      { id: 'email-input', name: 'email', value: 'Email', type: 'email', placeholder: 'Email', minLength: 1 },
      {
        id: 'password-input',
        name: 'password',
        value: 'Password',
        type: 'password',
        placeholder: 'Password',
        minLength: 5
      },
      {
        id: 'passwordConfirmation-input',
        name: 'passwordConfirmation',
        value: 'Password Confirmation',
        type: 'password',
        placeholder: 'Password Confirmation',
        minLength: 5
      }
    ];
  };
}

// import React from 'react';
// import PropTypes from 'prop-types';
// import { Field, reduxForm } from 'redux-form';
// import { Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';
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
// const RegisterForm = ({ handleSubmit, submitting, onSubmit, errors }) => {
//   return (
//     <Form name="register" onSubmit={handleSubmit(onSubmit)}>
//       <Field name="username" component={renderField} type="text" label="Username" validate={required} />
//       <Field name="email" component={renderField} type="email" label="Email" validate={required} />
//       <Field name="password" component={renderField} type="password" label="Password" validate={required} />
//       {errors && (
//         <FormGroup color="danger">
//           <FormFeedback>{errors.map(error => <li key={error.field}>{error.message}</li>)}</FormFeedback>
//         </FormGroup>
//       )}
//       <Button color="primary" type="submit" disabled={submitting}>
//         Register
//       </Button>
//     </Form>
//   );
// };
//
// RegisterForm.propTypes = {
//   handleSubmit: PropTypes.func,
//   onSubmit: PropTypes.func,
//   submitting: PropTypes.bool,
//   errors: PropTypes.array
// };
//
// export default reduxForm({
//   form: 'register'
// })(RegisterForm);
