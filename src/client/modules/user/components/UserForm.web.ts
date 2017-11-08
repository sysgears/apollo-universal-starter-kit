import { Component, Input, OnDestroy, OnInit } from '@angular/core';

enum InputType {
  INPUT = 0,
  SELECTOR = 1,
  RADIO_BUTTON = 2
}

interface FormInput {
  id: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  inputType: InputType;
  options?: any[];
  minLength?: number;
  required?: boolean;
}

@Component({
  selector: 'user-form',
  template: `
    <div *ngIf="loading">Loading...</div>

    <div *ngIf="errors">
      <div *ngFor="let error of errors" class="alert alert-danger" role="alert" [id]="error.field">
        {{error.message}}
      </div>
    </div>

    <form *ngIf="!loading && user" name="userForm" #userForm="ngForm" (ngSubmit)="onSubmit(user)">
      <div [ngClass]="{'form-group': fi.inputType !== 2, 'form-check': fi.inputType === 2}" *ngFor="let fi of formInputs">

        <span *ngIf="fi.inputType === 0">
          <label for="{{fi.id}}">{{fi.value}}</label>
          <input id="{{fi.id}}"
                 type="{{fi.type}}"
                 class="form-control"
                 placeholder="{{fi.value}}"
                 name="{{fi.name}}"
                 [(ngModel)]="user[fi.name]"
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

        </span>

        <span *ngIf="fi.inputType === 1">
          <label for="{{fi.id}}">{{fi.value}}</label>
          <select id="fi.id" name="{{fi.name}}" class="form-control" [(ngModel)]="user[fi.name]" required>
            <option *ngFor="let o of fi.options">{{o}}</option>
          </select>
        </span>

        <span *ngIf="fi.inputType === 2">
          <label for="{{fi.id}}" class="form-check-label">
            <input type="checkbox" id="{{fi.id}}" name="{{fi.name}}" class="form-check-input" [(ngModel)]="user[fi.name]" />
            {{fi.value}}
          </label>
        </span>

      </div>
      <button type="submit" id="register-submit-btn" class="btn btn-primary" [disabled]="!userForm.form.valid">Save</button>
    </form>
  `,
  styles: ['small {color: brown}']
})
export default class UserForm implements OnInit, OnDestroy {
  @Input() public onSubmit: any;
  @Input() public loading: boolean;
  @Input() public user: any;
  @Input() public errors: any[];

  public formInputs: FormInput[];
  public pattern: any;
  public patternMsg: any;

  constructor() {
    this.formInputs = this.getForm();
    this.pattern = this.getPattern;
    this.patternMsg = this.getPatternMsg;
  }

  public ngOnInit(): void {}

  public ngOnDestroy(): void {}

  private getPattern = (fieldName: string) => {
    let pat: any = null;

    if (fieldName === 'email') {
      pat = '^[a-zA-Z0–9_.+-]+@[a-zA-Z0–9-]+\\.[a-zA-Z0–9.]+$';
    }

    if (fieldName === 'passwordConfirmation') {
      pat = this.user.password || null;
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
        inputType: InputType.INPUT,
        minLength: 1,
        required: true
      },
      {
        id: 'email-input',
        name: 'email',
        value: 'Email',
        type: 'email',
        placeholder: 'Email',
        inputType: InputType.INPUT,
        minLength: 3,
        required: true
      },
      {
        id: 'role-selector',
        name: 'role',
        value: 'Role',
        inputType: InputType.SELECTOR,
        options: ['user', 'admin'],
        required: true
      },
      {
        id: 'active-radio',
        name: 'isActive',
        value: 'Is Active',
        inputType: InputType.RADIO_BUTTON,
        required: true
      },
      {
        id: 'first-name-input',
        name: 'firstName',
        value: 'First Name',
        type: 'text',
        placeholder: 'First Name',
        inputType: InputType.INPUT,
        required: true
      },
      {
        id: 'last-name-input',
        name: 'lastName',
        value: 'Last Name',
        type: 'text',
        placeholder: 'Last Name',
        inputType: InputType.INPUT,
        required: true
      },
      {
        id: 'password-input',
        name: 'password',
        value: 'Password',
        type: 'password',
        placeholder: 'Password',
        inputType: InputType.INPUT,
        minLength: 5,
        required: true
      },
      {
        id: 'passwordConfirmation-input',
        name: 'passwordConfirmation',
        value: 'Password Confirmation',
        type: 'password',
        placeholder: 'Password Confirmation',
        inputType: InputType.INPUT,
        minLength: 5,
        required: true
      }
    ];
  };
}

// import React from 'react';
// import PropTypes from 'prop-types';
// import { Field, reduxForm } from 'redux-form';
// import { Form, RenderField, RenderSelect, RenderCheckBox, Option, Button, Alert } from '../../common/components/web';
// import settings from '../../../../../settings';
//
// const required = value => (value ? undefined : 'Required');
//
// export const minLength = min => value =>
//   value && value.length < min ? `Must be ${min} characters or more` : undefined;
// export const minLength3 = minLength(3);
//
// const validate = values => {
//   const errors = {};
//
//   if (values.password !== values.passwordConfirmation) {
//     errors.passwordConfirmation = 'Passwords do not match';
//   }
//   return errors;
// };
//
// const UserForm = ({ handleSubmit, submitting, onSubmit, error }) => {
//   return (
//     <Form name="post" onSubmit={handleSubmit(onSubmit)}>
//   <Field name="username" component={RenderField} type="text" label="Username" validate={[required, minLength3]} />
//   <Field name="email" component={RenderField} type="email" label="Email" validate={required} />
//   <Field name="role" component={RenderSelect} type="select" label="Role">
//   <Option value="user">user</Option>
//     <Option value="admin">admin</Option>
//     </Field>
//     <Field name="isActive" component={RenderCheckBox} type="checkbox" label="Is Active" />
//   <Field name="profile.firstName" component={RenderField} type="text" label="First Name" validate={required} />
//   <Field name="profile.lastName" component={RenderField} type="text" label="Last Name" validate={required} />
//   {settings.user.auth.certificate.enabled && (
//     <Field name="auth.certificate.serial" component={RenderField} type="text" label="Serial" validate={required} />
//   )}
//   <Field name="password" component={RenderField} type="password" label="Password" />
//   <Field name="passwordConfirmation" component={RenderField} type="password" label="Password Confirmation" />
//   {error && <Alert color="error">{error}</Alert>}
//     <Button color="primary" type="submit" disabled={submitting}>
//     Save
//     </Button>
//     </Form>
// );
// };
//
// UserForm.propTypes = {
//   handleSubmit: PropTypes.func,
//   onSubmit: PropTypes.func,
//   submitting: PropTypes.bool,
//   error: PropTypes.string
// };
//
// export default reduxForm({
//   form: 'user',
//   validate
// })(UserForm);
