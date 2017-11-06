import { Component, Input } from '@angular/core';

@Component({
  selector: 'forgot-password-form',
  template: `
    <form name="forgotPasswordForm" #forgotPasswordForm="ngForm" (ngSubmit)="onSubmit(forgotPasswordForm.form.value)">
      <div *ngIf="sent" class="alert alert-success">
        <div>Reset password instructions have been emailed to you.</div>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input id="email"
               type="email"
               class="form-control"
               placeholder="Email"
               name="Email"
               [(ngModel)]="form.email"
               #name="ngModel"
               pattern="{{emailPattern}}"
               required />

        <div *ngIf="name.invalid && (name.dirty || name.touched)">
          <small [hidden]="!name.errors.required">
            Email is required.
          </small>
          <small *ngIf="name.errors.pattern">
            Email should be like john@doe.com
          </small>
        </div>
      </div>

      <button type="submit" id="login-submit-btn" class="btn btn-primary" [disabled]="!forgotPasswordForm.form.valid || submitting">
        Send Reset Instructions
      </button>
    </form>
  `
})
export default class ForgotPasswordForm {
  @Input() public onSubmit: any;
  @Input() public sent: boolean;
  @Input() public submitting: boolean;
  public form: any = {};
  public emailPattern: any = '^[a-zA-Z0–9_.+-]+@[a-zA-Z0–9-]+\\.[a-zA-Z0–9.]+$';

  constructor() {}
}

// import React from 'react';
// import PropTypes from 'prop-types';
// import { Field, reduxForm } from 'redux-form';
// import { Form, RenderField, Button, Alert } from '../../common/components/web';
//
// const required = value => (value ? undefined : 'Required');
//
// const ForgotPasswordForm = ({ handleSubmit, submitting, onSubmit, error, sent }) => {
//   return (
//     <Form name="forgotPassword" onSubmit={handleSubmit(onSubmit)}>
//       {sent && <Alert color="success">Reset password instructions have been emailed to you.</Alert>}
//       <Field name="email" component={RenderField} type="email" label="Email" validate={required} />
//       {error && <Alert color="error">{error}</Alert>}
//       <Button color="primary" type="submit" disabled={submitting}>
//         Send Reset Instructions
//       </Button>
//     </Form>
//   );
// };
//
// ForgotPasswordForm.propTypes = {
//   handleSubmit: PropTypes.func,
//   onSubmit: PropTypes.func,
//   submitting: PropTypes.bool,
//   error: PropTypes.string,
//   sent: PropTypes.bool
// };
//
// export default reduxForm({
//   form: 'forgotPassword'
// })(ForgotPasswordForm);
