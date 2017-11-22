import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormInput } from './Form';

export enum ItemType {
  INPUT = 0,
  SELECTOR = 1,
  RADIO_BUTTON = 2
}

@Component({
  selector: 'form-item',
  template: `
    <span *ngIf="itemType === 0">
      <label for="{{formInput.id}}">{{formInput.value}}</label>
      <input id="{{formInput.id}}"
             [ngrxFormControlState]="form.controls[formInput.name]"
             [ngrxEnableFocusTracking]="true"
             type="{{formInput.type}}"
             class="form-control"
             placeholder="{{formInput.placeholder}}"
             name="{{formInput.name}}"
             [(ngModel)]="form.value[formInput.name]" />

      <div *ngIf="form.controls[formInput.name].isInvalid && (form.controls[formInput.name].isDirty || form.controls[formInput.name].isTouched)">
        <small [hidden]="!form.controls[formInput.name].errors[formInput.name]">
          {{form.controls[formInput.name].errors[formInput.name]}}
        </small>
        <small [hidden]="!form.controls[formInput.name].errors.required">
          {{formInput.value}} is required
        </small>
      </div>
    </span>

    <span *ngIf="itemType === 1">
      <render-select [input]="formInput" [reduxForm]="form"></render-select>
    </span>

    <span *ngIf="itemType === 2">
      <render-checkbox [input]="formInput" [reduxForm]="form"></render-checkbox>
    </span>
  `,
  styles: ['small {color: brown}']
})
export default class {
  @Input() public itemType: ItemType;
  @Input() public formInput: FormInput;
  @Input() public name: string;
  @Input() public form: any;

  @Output() public onModelChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}
}
