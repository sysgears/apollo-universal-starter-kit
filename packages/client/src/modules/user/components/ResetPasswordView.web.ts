import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Subject } from 'rxjs/Subject';

import { AlertItem, createErrorAlert } from '../../common/components/Alert';
import { FormInput } from '../../ui-bootstrap/components/Form';
import { ItemType } from '../../ui-bootstrap/components/FormItem';
import ResetPasswordService from '../containers/ResetPassword';
import { RegisterFormData, ResetPasswordFormState } from '../reducers/index';

@Component({
  selector: 'reset-password-view',
  template: `
    <h1>Reset password!</h1>

    <alert [subject]="alertSubject"></alert>

    <ausk-form [onSubmit]="onSubmit"
               [submitting]="submitting"
               [formName]="'resetPasswordForm'"
               [formState]="formState"
               [form]="form"
               [btnName]="'Reset Password'">
    </ausk-form>
  `
})
export default class ResetPasswordView implements OnInit {
  public sent: boolean = false;
  public submitting: boolean = false;
  public alertSubject: Subject<AlertItem> = new Subject<AlertItem>();
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
            resetPassword.errors.forEach((error: any) => this.alertSubject.next(createErrorAlert(error.message)));
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
        label: 'Password',
        placeholder: 'Password',
        inputType: ItemType.INPUT,
        minLength: 5
      },
      {
        id: 'passwordConfirmation-input',
        name: 'passwordConfirmation',
        value: 'Password Confirmation',
        type: 'password',
        label: 'Password Confirmation',
        placeholder: 'Password Confirmation',
        inputType: ItemType.INPUT,
        minLength: 5
      }
    ];
  };
}
