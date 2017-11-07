import { Component, Input } from '@angular/core';

@Component({
  selector: 'reset-password-form',
  template: `
    <form name="resetPasswordForm" #resetPasswordForm="ngForm" (ngSubmit)="onSubmit(resetPasswordForm.form.value)">
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password"
               type="password"
               class="form-control"
               placeholder="Password"
               name="password"
               [(ngModel)]="form.password"
               #pwd="ngModel"
               minlength="5"
               required />

        <div *ngIf="pwd.invalid && (pwd.dirty || pwd.touched)">
          <small *ngIf="pwd.errors.minlength">
            Min length should be 5.
          </small>
        </div>
      </div>

      <div class="form-group">
        <label for="passwordConfirmation">Password Confirmation</label>
        <input id="passwordConfirmation"
               type="password"
               class="form-control"
               placeholder="Password Confirmation"
               name="passwordConfirmation"
               [(ngModel)]="form.passwordConfirmation"
               #pwdCfrm="ngModel"
               pattern="{{form.password}}"
               required />

        <div *ngIf="pwdCfrm.invalid && (pwdCfrm.dirty || pwdCfrm.touched)">
          <small *ngIf="pwdCfrm.errors.pattern">
            Should match to password.
          </small>
        </div>
      </div>

      <button type="submit" id="login-submit-btn" class="btn btn-primary" [disabled]="!resetPasswordForm.form.valid || submitting">
        Reset Password
      </button>
    </form>
  `,
  styles: ['small {color: brown}']
})
export default class ResetPasswordForm {
  @Input() public onSubmit: any;
  @Input() public sent: boolean;
  @Input() public submitting: boolean;
  public form: any = {};

  constructor() {}
}

// import React from 'react';
// import PropTypes from 'prop-types';
// import { Field, reduxForm } from 'redux-form';
// import { Form, RenderField, Button, Alert } from '../../common/components/web';
//
// const required = value => (value ? undefined : 'Required');
//
// export const minLength = min => value =>
//   value && value.length < min ? `Must be ${min} characters or more` : undefined;
// export const minLength5 = minLength(5);
//
// const validate = values => {
//   const errors = {};
//
//   if (values.password && values.passwordConfirmation && values.password !== values.passwordConfirmation) {
//     errors.passwordConfirmation = 'Passwords do not match';
//   }
//   return errors;
// };
//
// const ResetPasswordForm = ({ handleSubmit, submitting, onSubmit, error }) => {
//   return (
//     <Form name="resetPassword" onSubmit={handleSubmit(onSubmit)}>
//       <Field
//         name="password"
//         component={RenderField}
//         type="password"
//         label="Password"
//         validate={[required, minLength5]}
//       />
//       <Field
//         name="passwordConfirmation"
//         component={RenderField}
//         type="password"
//         label="Password Confirmation"
//         validate={[required, minLength5]}
//       />
//       {error && <Alert color="error">{error}</Alert>}
//       <Button color="primary" type="submit" disabled={submitting}>
//         Reset Password
//       </Button>
//     </Form>
//   );
// };
//
// ResetPasswordForm.propTypes = {
//   handleSubmit: PropTypes.func,
//   onSubmit: PropTypes.func,
//   submitting: PropTypes.bool,
//   error: PropTypes.string
// };
//
// export default reduxForm({
//   form: 'resetPassword',
//   validate
// })(ResetPasswordForm);
