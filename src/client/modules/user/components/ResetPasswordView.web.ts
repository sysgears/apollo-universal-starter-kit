import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import ResetPasswordService from '../containers/ResetPassword';
import { RegisterFormData, ResetPasswordFormState } from '../reducers/index';
import { FormInput, InputType } from './UserEditView';

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

      <reset-password-form [onSubmit]="onSubmit" [sent]="sent" [submitting]="submitting" [formState]="formState" [form]="form"></reset-password-form>
    </div>
  `
})
export default class ResetPasswordView implements OnInit {
  public sent: boolean = false;
  public submitting: boolean = false;
  public errors: any[];
  private token: string;
  public formState: FormGroupState<RegisterFormData>;
  public form: FormInput[];

  constructor(
    private route: ActivatedRoute,
    private resetPasswordService: ResetPasswordService,
    private store: Store<ResetPasswordFormState>
  ) {
    this.form = this.createForm();
    store.select(s => s.resetPasswordForm).subscribe((res: any) => {
      this.formState = res;
    });
  }

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

  private createForm = (): FormInput[] => {
    return [
      {
        id: 'password-input',
        name: 'password',
        value: 'Password',
        type: 'password',
        placeholder: 'Password',
        inputType: InputType.INPUT,
        minLength: 5
      },
      {
        id: 'passwordConfirmation-input',
        name: 'passwordConfirmation',
        value: 'Password Confirmation',
        type: 'password',
        placeholder: 'Password Confirmation',
        inputType: InputType.INPUT,
        minLength: 5
      }
    ];
  };
}
