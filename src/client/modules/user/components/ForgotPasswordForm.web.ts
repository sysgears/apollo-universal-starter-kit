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
               #email="ngModel"
               pattern="{{emailPattern}}"
               required />

        <div *ngIf="email.invalid && (email.dirty || email.touched)">
          <small [hidden]="!email.errors.required">
            Email is required.
          </small>
          <small *ngIf="email.errors.pattern">
            Email should be like john@doe.com
          </small>
        </div>
      </div>

      <button type="submit" id="login-submit-btn" class="btn btn-primary" [disabled]="!forgotPasswordForm.form.valid || submitting">
        Send Reset Instructions
      </button>
    </form>
  `,
  styles: ['small {color: brown}']
})
export default class ForgotPasswordForm {
  @Input() public onSubmit: any;
  @Input() public sent: boolean;
  @Input() public submitting: boolean;
  public form: any = {};
  public emailPattern: any = '^[a-zA-Z0–9_.+-]+@[a-zA-Z0–9-]+\\.[a-zA-Z0–9.]+$';

  constructor() {}
}
