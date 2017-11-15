import { Component, Input } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';
import { LoginFormData } from '../reducers/index';

interface FormInput {
  id: string;
  name: string;
  value: string;
  type: string;
  placeholder: string;
  minLength?: number;
}

@Component({
  selector: 'register-form',
  template: `
    <form name="login" (ngSubmit)="onSubmit(formState.registerForm.value)" [ngrxFormState]="formState">
      <div class="form-group" *ngFor="let fi of form">
        <label for="{{fi.id}}">{{fi.value}}</label>
        <input id="{{fi.id}}"
               [ngrxFormControlState]="formState.registerForm.controls[fi.name]"
               type="{{fi.type}}"
               class="form-control"
               placeholder="{{fi.placeholder}}"
               name="{{fi.name}}"
               [(ngModel)]="formState.registerForm.value[fi.name]" />

        <div *ngIf="formState.registerForm.controls[fi.name].isInvalid && (formState.registerForm.controls[fi.name].isDirty || formState.registerForm.controls[fi.name].isTouched)">
          <small [hidden]="!formState.registerForm.controls[fi.name].errors[fi.name]">
            {{formState.registerForm.controls[fi.name].errors[fi.name]}}
          </small>
          <small [hidden]="!formState.registerForm.controls[fi.name].errors.required">
            {{fi.value}} is required
          </small>
        </div>

      </div>
      <button type="submit" id="register-submit-btn" class="btn btn-primary" [disabled]="formState.registerForm.isInvalid">Register</button>
    </form>
  `,
  styles: ['small {color: brown}']
})
export default class RegisterForm {
  @Input() public onSubmit: any;
  @Input() public formState: FormGroupState<LoginFormData>;
  @Input() public form: FormInput[];

  constructor() {}
}
