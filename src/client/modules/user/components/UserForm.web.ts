import { Component, Input } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';
import { UserFormData } from '../reducers/index';
import { FormInput } from './UserEditView';

@Component({
  selector: 'user-form',
  template: `
    <div *ngIf="loading">Loading...</div>
    <form *ngIf="!loading" name="userForm" (ngSubmit)="onSubmit(formState.userForm.value)" [ngrxFormState]="formState">
      <div [ngClass]="{'form-group': fi.inputType !== 2, 'form-check': fi.inputType === 2}" *ngFor="let fi of form">

        <span *ngIf="fi.inputType === 0">
          <label for="{{fi.id}}">{{fi.value}}</label>
          <input id="{{fi.id}}"
                 [ngrxFormControlState]="formState.userForm.controls[fi.name]"
                 [ngrxEnableFocusTracking]="true"
                 type="{{fi.type}}"
                 class="form-control"
                 placeholder="{{fi.placeholder}}"
                 name="{{fi.name}}"
                 [(ngModel)]="formState.userForm.value[fi.name]" />

          <div *ngIf="formState.userForm.controls[fi.name].isInvalid && (formState.userForm.controls[fi.name].isDirty || formState.userForm.controls[fi.name].isTouched)">
            <small [hidden]="!formState.userForm.controls[fi.name].errors[fi.name]">
              {{formState.userForm.controls[fi.name].errors[fi.name]}}
            </small>
            <small [hidden]="!formState.userForm.controls[fi.name].errors.required">
              {{fi.value}} is required
            </small>
          </div>
        </span>

        <span *ngIf="fi.inputType === 1">
          <label for="{{fi.id}}">{{fi.value}}</label>
          <select id="{{fi.id}}"
                  [ngrxFormControlState]="formState.userForm.controls[fi.name]"
                  [ngrxEnableFocusTracking]="true"
                  name="{{fi.name}}"
                  class="form-control"
                  [(ngModel)]="formState.userForm.value[fi.name]">
            <option *ngFor="let o of fi.options">{{o}}</option>
          </select>

          <div *ngIf="formState.userForm.controls[fi.name].isInvalid && (formState.userForm.controls[fi.name].isDirty || formState.userForm.controls[fi.name].isTouched)">
            <small [hidden]="!formState.userForm.controls[fi.name].errors[fi.name]">
              {{formState.userForm.controls[fi.name].errors[fi.name]}}
            </small>
            <small [hidden]="!formState.userForm.controls[fi.name].errors.required">
              {{fi.value}} is required
            </small>
          </div>

        </span>

        <span *ngIf="fi.inputType === 2">
          <label for="{{fi.id}}" class="form-check-label">
            <input type="checkbox"
                   id="{{fi.id}}"
                   [ngrxFormControlState]="formState.userForm.controls[fi.name]"
                   [ngrxEnableFocusTracking]="true"
                   name="{{fi.name}}"
                   class="form-check-input"
                   [(ngModel)]="formState.userForm.value[fi.name]" />
            {{fi.value}}
          </label>

          <div *ngIf="formState.userForm.controls[fi.name].isInvalid && (formState.userForm.controls[fi.name].isDirty || formState.userForm.controls[fi.name].isTouched)">
            <small [hidden]="!formState.userForm.controls[fi.name].errors[fi.name]">
              {{formState.userForm.controls[fi.name].errors[fi.name]}}
            </small>
            <small [hidden]="!formState.userForm.controls[fi.name].errors.required">
              {{fi.value}} is required
            </small>
          </div>
        </span>

      </div>
      <button type="submit" id="register-submit-btn" class="btn btn-primary" [disabled]="formState.userForm.isInvalid">Save</button>
    </form>
  `,
  styles: ['small {color: brown}']
})
export default class UserForm {
  @Input() public onSubmit: any;
  @Input() public loading: boolean;
  @Input() public formState: FormGroupState<UserFormData>;
  @Input() public form: FormInput[];

  constructor() {}
}
