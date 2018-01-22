import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormInput } from './Form';

@Component({
  selector: 'render-checkbox',
  template: `
    <div class="ant-form-item-label">
      <label class="" *ngIf="input.label" for="{{input.id}}">{{input.label}}</label>
    </div>
    <div class="ant-form-item-control-wrapper">
      <div class="ant-form-item-control ">
        <div>
          <label class="ant-checkbox-wrapper">
            <span class="ant-checkbox" [ngClass]="{'ant-checkbox-checked': reduxForm?.value[input.name]}">
              <input type="checkbox"
                     id="{{input.id}}"
                     name="{{input.name}}"
                     [ngrxFormControlState]="reduxForm.controls[input.name]"
                     [ngrxEnableFocusTracking]="true"
                     class="ant-checkbox-input"
                     (ngModelChange)="changed({ id: input.id, value: $event })"
                     [(ngModel)]="reduxForm?.value[input.name]"/>
              <span class="ant-checkbox-inner"></span>
            </span>
            {{input.label}}
          </label>
        </div>
      </div>
    </div>


    <div
        *ngIf="reduxForm.controls[input.name].isInvalid && (reduxForm.controls[input.name].isDirty || reduxForm.controls[input.name].isTouched)">
      <small [hidden]="!reduxForm.controls[input.name].errors[input.name]">
        {{reduxForm.controls[input.name].errors[input.name]}}
      </small>
      <small [hidden]="!control.errors.required">
        {{input.value}} is required
      </small>
    </div>
  `,
  styles: ['small {color: brown}']
})
export default class {
  @Input() public input: FormInput;
  @Input() public reduxForm: any;
  @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  public changed = (e: any) => {
    this.onChange.emit(e);
  };
}
