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
