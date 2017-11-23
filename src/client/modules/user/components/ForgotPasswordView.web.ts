import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { FormInput } from '../../ui-bootstrap/components/Form';
import { ItemType } from '../../ui-bootstrap/components/FormItem';
import ForgotPasswordService from '../containers/ForgotPassword';
import { ForgotPasswordFormData, ForgotPasswordFormState, ResetForgotPasswordFormAction } from '../reducers/index';

@Component({
  selector: 'forgot-password-view',
  template: `
    <h1>Forgot password!</h1>

    <div *ngIf="sent" class="alert alert-success">
      <div>Reset password instructions have been emailed to you.</div>
    </div>

    <div *ngIf="errors">
      <div *ngFor="let error of errors" class="alert alert-danger" role="alert" [id]="error.field">
        {{error.message}}
      </div>
    </div>

    <ausk-form [onSubmit]="onSubmit"
               [submitting]="submitting"
               [formName]="'forgotPasswordForm'"
               [form]="form"
               [formState]="formState"
               [btnName]="'Send Reset Instructions'">
    </ausk-form>
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
        label: 'Email',
        placeholder: 'Email',
        inputType: ItemType.INPUT
      }
    ];
  };
}
