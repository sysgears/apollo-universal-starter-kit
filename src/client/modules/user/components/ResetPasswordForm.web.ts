import { Component, Input } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';
import { LoginFormData } from '../reducers/index';
import { FormInput } from './UserEditView';

@Component({
  selector: 'reset-password-form',
  template: `
    <form name="resetPasswordForm" (ngSubmit)="onSubmit(formState.resetPasswordForm.value)" [ngrxFormState]="formState">
      <div class="form-group" *ngFor="let fi of form">
        <label for="{{fi.id}}">{{fi.value}}</label>
        <input id="{{fi.id}}"
               [ngrxFormControlState]="formState.resetPasswordForm.controls[fi.name]"
               type="{{fi.type}}"
               class="form-control"
               placeholder="{{fi.placeholder}}"
               name="{{fi.name}}"
               [(ngModel)]="formState.resetPasswordForm.value[fi.name]" />

        <div *ngIf="formState.resetPasswordForm.controls[fi.name].isInvalid && (formState.resetPasswordForm.controls[fi.name].isDirty || formState.resetPasswordForm.controls[fi.name].isTouched)">
          <small [hidden]="!formState.resetPasswordForm.controls[fi.name].errors[fi.name]">
            {{formState.resetPasswordForm.controls[fi.name].errors[fi.name]}}
          </small>
          <small [hidden]="!formState.resetPasswordForm.controls[fi.name].errors.required">
            {{fi.value}} is required
          </small>
        </div>

      </div>
      <button type="submit" id="register-submit-btn" class="btn btn-primary" [disabled]="formState.resetPasswordForm.isInvalid">Reset Password</button>
    </form>
  `,
  styles: ['small {color: brown}']
})
export default class ResetPasswordForm {
  @Input() public onSubmit: any;
  @Input() public sent: boolean;
  @Input() public submitting: boolean;
  @Input() public formState: FormGroupState<LoginFormData>;
  @Input() public form: FormInput[];

  constructor() {}
}
