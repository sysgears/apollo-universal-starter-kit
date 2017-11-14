import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import ResetPasswordService from '../containers/ResetPassword';

@Component({
  selector: 'reset-password-view',
  template: `
    <div id="content" class="container">
      <h1>Reset password!</h1>

      <div *ngIf="errors">
        <div *ngFor="let error of errors" class="alert alert-danger" role="alert" [id]="error.field">
          {{error.message}}
        </div>
      </div>

      <reset-password-form [onSubmit]="onSubmit" [sent]="sent" [submitting]="submitting"></reset-password-form>
    </div>
  `
})
export default class ResetPasswordView implements OnInit {
  public sent: boolean = false;
  public submitting: boolean = false;
  public errors: any[];
  private token: string;

  constructor(private route: ActivatedRoute, private resetPasswordService: ResetPasswordService) {}

  public ngOnInit(): void {
    this.route.params.subscribe((p: any) => {
      this.token = p.token;
    });
  }

  public onSubmit = ({ password, passwordConfirmation }: any) => {
    if (this.token) {
      this.submitting = true;
      this.resetPasswordService.resetPassword(
        password,
        passwordConfirmation,
        this.token,
        ({ data: { resetPassword } }: any) => {
          this.sent = true;
          this.submitting = false;

          if (resetPassword.errors) {
            this.errors = resetPassword.errors;
            return;
          }
        }
      );
    }
  };
}
