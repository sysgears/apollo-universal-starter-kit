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
      <label for="{{formInput.id}}">{{formInput.value}}</label>
      <select id="{{formInput.id}}"
              [ngrxFormControlState]="form.controls[formInput.name]"
              [ngrxEnableFocusTracking]="true"
              name="{{formInput.name}}"
              class="form-control"
              (change)="onModelChanged.emit({ name: formInput.name, value: currValue})"
              [(ngModel)]="form.value[formInput.name]">
        <option *ngFor="let o of formInput.options">{{o}}</option>
      </select>

      <div *ngIf="form.controls[formInput.name].isInvalid && (form.controls[formInput.name].isDirty || form.controls[formInput.name].isTouched)">
        <small [hidden]="!form.controls[formInput.name].errors[formInput.name]">
          {{form.controls[formInput.name].errors[formInput.name]}}
        </small>
        <small [hidden]="!control.errors.required">
          {{formInput.value}} is required
        </small>
      </div>

    </span>

    <span *ngIf="itemType === 2">
      <label for="{{formInput.id}}" class="form-check-label">
        <input type="checkbox"
               id="{{formInput.id}}"
               [ngrxFormControlState]="form.controls[formInput.name]"
               [ngrxEnableFocusTracking]="true"
               name="{{formInput.name}}"
               (change)="onModelChanged.emit({ name: formInput.name, value: currValue})"
               class="form-check-input"
               [(ngModel)]="form.value[formInput.name]" />
        {{formInput.value}}
      </label>

      <div *ngIf="form.controls[formInput.name].isInvalid && (form.controls[formInput.name].isDirty || form.controls[formInput.name].isTouched)">
        <small [hidden]="!form.controls[formInput.name].errors[formInput.name]">
          {{form.controls[formInput.name].errors[formInput.name]}}
        </small>
        <small [hidden]="!control.errors.required">
          {{formInput.value}} is required
        </small>
      </div>
    </span>
  `,
  styles: ['small {color: brown}']
})
export default class {
  @Input() public itemType: ItemType;
  @Input() public formInput: FormInput;
  @Input() public name: string;
  @Input() public form: string;

  @Output() public onModelChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}
}
