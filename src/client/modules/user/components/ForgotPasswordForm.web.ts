import { Component, Input } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';
import { ForgotPasswordFormData } from '../reducers/index';

@Component({
  selector: 'forgot-password-form',
  template: `
    <form novalidate name="forgotPasswordForm" (ngSubmit)="onSubmit((formState.forgotPasswordForm.value))" [ngrxFormState]="formState">
      <div *ngIf="sent" class="alert alert-success">
        <div>Reset password instructions have been emailed to you.</div>
      </div>

      <div class="form-group" *ngFor="let fi of form">
        <label for="{{fi.id}}">{{fi.value}}</label>
        <input id="{{fi.id}}"
               [ngrxFormControlState]="formState.forgotPasswordForm.controls[fi.name]"
               type="{{fi.type}}"
               class="form-control"
               placeholder="{{fi.placeholder}}"
               name="{{fi.name}}"
               [(ngModel)]="formState.forgotPasswordForm.value[fi.name]" />

        <div *ngIf="formState.forgotPasswordForm.controls[fi.name].isInvalid && (formState.forgotPasswordForm.controls[fi.name].isDirty || formState.forgotPasswordForm.controls[fi.name].isTouched)">
          <small [hidden]="!formState.forgotPasswordForm.controls[fi.name].errors[fi.name]">
            {{formState.forgotPasswordForm.controls[fi.name].errors[fi.name]}}
          </small>
          <small [hidden]="!formState.forgotPasswordForm.controls[fi.name].errors.required">
            {{fi.value}} is required
          </small>
        </div>

      </div>

      <button type="submit" id="login-submit-btn" class="btn btn-primary" [disabled]="formState.forgotPasswordForm.isInvalid || submitting">
        Send Reset Instructions
      </button>
    </form>
  `,
  styles: ['small {color: brown}']
})
export default class ForgotPasswordForm {
  @Input() public formState: FormGroupState<ForgotPasswordFormData>;
  @Input() public onSubmit: any;
  @Input() public sent: boolean;
  @Input() public submitting: boolean;
  @Input() public form: any;

  constructor() {}
}
