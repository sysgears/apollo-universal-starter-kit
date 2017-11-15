import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import ForgotPasswordService from '../containers/ForgotPassword';
import { ForgotPasswordFormData, ForgotPasswordFormState, ResetForgotPasswordFormAction } from '../reducers/index';
import { FormInput, InputType } from './UserEditView';

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

      <forgot-password-form [onSubmit]="onSubmit" [sent]="sent" [submitting]="submitting" [form]="form" [formState]="formState"></forgot-password-form>
    </div>
  `
})
export default class ForgotPasswordView {
  public form: FormInput[];
  public sent: boolean = false;
  public submitting: boolean = false;
  public errors: any[] = [];
  public formState: FormGroupState<ForgotPasswordFormData>;

  constructor(private forgotPasswordService: ForgotPasswordService, private store: Store<ForgotPasswordFormState>) {
    this.form = this.createForm();
    store.select(s => s.forgotPasswordForm).subscribe((res: any) => {
      this.formState = res;
    });
  }

  public onSubmit = (email: string) => {
    this.submitting = true;
    this.forgotPasswordService.forgotPassword(email, ({ data: { forgotPassword } }: any) => {
      this.sent = true;
      this.submitting = false;
      if (forgotPassword.errors) {
        this.errors = forgotPassword.errors;
        return;
      }
      this.store.dispatch(new ResetForgotPasswordFormAction());
    });
  };

  private createForm = (): FormInput[] => {
    return [
      {
        id: 'email-input',
        name: 'email',
        value: 'Email',
        type: 'email',
        placeholder: 'Email',
        inputType: InputType.INPUT
      }
    ];
  };
}
