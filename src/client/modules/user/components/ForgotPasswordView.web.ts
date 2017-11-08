import { Component } from '@angular/core';
import ForgotPasswordService from '../containers/ForgotPassword';

@Component({
  selector: 'forgot-password-view',
  template: `
    <div id="content" class="container">
      <h1>Forgot password!</h1>

      <div *ngIf="errors">
        <div *ngFor="let error of errors" class="alert alert-danger" role="alert" [id]="error.field">
          {{error.message}}
        </div>
      </div>

      <forgot-password-form [onSubmit]="onSubmit" [sent]="sent" [submitting]="submitting"></forgot-password-form>
    </div>
  `
})
export default class ForgotPasswordView {
  public sent: boolean = false;
  public submitting: boolean = false;
  public errors: any[] = [];

  constructor(private forgotPasswordService: ForgotPasswordService) {}

  public onSubmit = (email: string) => {
    this.submitting = true;
    this.forgotPasswordService.forgotPassword(email, ({ data: { forgotPassword } }: any) => {
      this.sent = true;
      this.submitting = false;
      if (forgotPassword.errors) {
        this.errors = forgotPassword.errors;
        return;
      }
    });
  };
}
