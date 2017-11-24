import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Subject } from 'rxjs/Subject';

import { AlertItem, createErrorAlert, createSuccessAlert } from '../../common/components/Alert';
import { FormInput } from '../../ui-bootstrap/components/Form';
import { ItemType } from '../../ui-bootstrap/components/FormItem';
import ForgotPasswordService from '../containers/ForgotPassword';
import { ForgotPasswordFormData, ForgotPasswordFormState, ResetForgotPasswordFormAction } from '../reducers/index';

@Component({
  selector: 'forgot-password-view',
  template: `
    <layout-center>
      <h1 class="text-center">Password Reset</h1>

      <alert [subject]="alertSubject"></alert>

      <ausk-form [onSubmit]="onSubmit"
                 [submitting]="submitting"
                 [formName]="'forgotPasswordForm'"
                 [form]="form"
                 [formState]="formState"
                 [btnName]="'Send Reset Instructions'"
                 [btnAlign]="'center'">
      </ausk-form>
    </layout-center>
  `
})
export default class ForgotPasswordView {
  public form: FormInput[];
  public sent: boolean = false;
  public submitting: boolean = false;
  public formState: FormGroupState<ForgotPasswordFormData>;
  public alertSubject: Subject<AlertItem> = new Subject<AlertItem>();

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
      this.alertSubject.next(createSuccessAlert('Reset password instructions have been emailed to you.'));
      this.submitting = false;
      if (forgotPassword.errors) {
        forgotPassword.errors.forEach((error: any) => this.alertSubject.next(createErrorAlert(error.message)));
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
