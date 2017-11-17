import { Component, Input } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';

export enum InputType {
  INPUT = 0,
  SELECTOR = 1,
  RADIO_BUTTON = 2
}

export interface FormInput {
  id: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  inputType: InputType;
  options?: any[];
  minLength?: number;
  required?: boolean;
}

@Component({
  selector: 'ausk-form',
  template: `
    <div *ngIf="loading">Loading...</div>
    <form *ngIf="!loading" name="{{formName}}" (ngSubmit)="onSubmit(formState[formName].value)" [ngrxFormState]="formState">
      <div [ngClass]="{'form-group': fi.inputType !== 2, 'form-check': fi.inputType === 2}" *ngFor="let fi of form">

        <span *ngIf="fi.inputType === 0">
          <label for="{{fi.id}}">{{fi.value}}</label>
          <input id="{{fi.id}}"
                 [ngrxFormControlState]="formState[formName].controls[fi.name]"
                 [ngrxEnableFocusTracking]="true"
                 type="{{fi.type}}"
                 class="form-control"
                 placeholder="{{fi.placeholder}}"
                 name="{{fi.name}}"
                 [(ngModel)]="formState[formName].value[fi.name]" />

          <div *ngIf="formState[formName].controls[fi.name].isInvalid && (formState[formName].controls[fi.name].isDirty || formState[formName].controls[fi.name].isTouched)">
            <small [hidden]="!formState[formName].controls[fi.name].errors[fi.name]">
              {{formState[formName].controls[fi.name].errors[fi.name]}}
            </small>
            <small [hidden]="!formState[formName].controls[fi.name].errors.required">
              {{fi.value}} is required
            </small>
          </div>
        </span>

        <span *ngIf="fi.inputType === 1">
          <label for="{{fi.id}}">{{fi.value}}</label>
          <select id="{{fi.id}}"
                  [ngrxFormControlState]="formState[formName].controls[fi.name]"
                  [ngrxEnableFocusTracking]="true"
                  name="{{fi.name}}"
                  class="form-control"
                  [(ngModel)]="formState[formName].value[fi.name]">
            <option *ngFor="let o of fi.options">{{o}}</option>
          </select>

          <div *ngIf="formState[formName].controls[fi.name].isInvalid && (formState[formName].controls[fi.name].isDirty || formState[formName].controls[fi.name].isTouched)">
            <small [hidden]="!formState[formName].controls[fi.name].errors[fi.name]">
              {{formState[formName].controls[fi.name].errors[fi.name]}}
            </small>
            <small [hidden]="!formState[formName].controls[fi.name].errors.required">
              {{fi.value}} is required
            </small>
          </div>

        </span>

        <span *ngIf="fi.inputType === 2">
          <label for="{{fi.id}}" class="form-check-label">
            <input type="checkbox"
                   id="{{fi.id}}"
                   [ngrxFormControlState]="formState[formName].controls[fi.name]"
                   [ngrxEnableFocusTracking]="true"
                   name="{{fi.name}}"
                   class="form-check-input"
                   [(ngModel)]="formState[formName].value[fi.name]" />
            {{fi.value}}
          </label>

          <div *ngIf="formState[formName].controls[fi.name].isInvalid && (formState[formName].controls[fi.name].isDirty || formState[formName].controls[fi.name].isTouched)">
            <small [hidden]="!formState[formName].controls[fi.name].errors[fi.name]">
              {{formState[formName].controls[fi.name].errors[fi.name]}}
            </small>
            <small [hidden]="!formState[formName].controls[fi.name].errors.required">
              {{fi.value}} is required
            </small>
          </div>
        </span>

      </div>
      <button type="submit" id="register-submit-btn" class="btn btn-primary" [disabled]="formState[formName].isInvalid || submitting">{{btnName}}</button>
    </form>
  `,
  styles: ['small {color: brown}']
})
export default class {
  @Input() public btnName: string;
  @Input() public onSubmit: any;
  @Input() public loading: boolean;
  @Input() public submitting: boolean;
  @Input() public formName: string;
  @Input() public formState: FormGroupState<any>;
  @Input() public form: FormInput[];

  constructor() {}
}
