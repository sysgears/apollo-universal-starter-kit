import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { FormInput } from '../../ui-bootstrap/components/Form';
import { ItemType } from '../../ui-bootstrap/components/FormItem';
import ForgotPasswordService from '../containers/ForgotPassword';
import { ForgotPasswordFormData, ForgotPasswordFormState, ResetForgotPasswordFormAction } from '../reducers/index';

const sentAlert = {
  field: 'sentSuccess',
  message: 'Reset password instructions have been emailed to you.',
  type: 'success'
};

@Component({
  selector: 'forgot-password-view',
  template: `
    <layout-center>
      <h1 class="text-center">Password Reset</h1>

      <alert [data]="alerts"></alert>

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
  public alerts: any[] = [];
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
      if (this.alerts.indexOf(sentAlert) === -1) {
        this.alerts.push(sentAlert);
      }
      this.submitting = false;
      if (forgotPassword.errors) {
        for (const error of forgotPassword.errors) {
          if (this.alerts.indexOf(error) < 0) {
            this.alerts.push(error);
          }
        }
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
