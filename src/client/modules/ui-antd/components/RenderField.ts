import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormInput } from './Form';

@Component({
  selector: 'render-field',
  template: `
    <div class="ant-row ant-form-item">
      <div class="ant-form-item-label">
        <label *ngIf="input.label" for="{{input.id}}">{{input.label}}</label>
      </div>
      <div class="ant-form-item-control-wrapper">
        <div class="ant-form-item-control ">
          <div>
            <input id="{{input.id}}"
                   type="{{input.type}}"
                   [ngrxFormControlState]="reduxForm.controls[input.name]"
                   [ngrxEnableFocusTracking]="true"
                   name="{{input.name}}"
                   class="ant-input"
                   placeholder="{{input.placeholder}}"
                   (ngModelChange)="changed({ id: input.id, value: $event })"
                   [(ngModel)]="reduxForm?.value[input.name]"/>
          </div>
        </div>
      </div>
    </div>

    <div
        *ngIf="reduxForm.controls[input.name].isInvalid && (reduxForm.controls[input.name].isDirty || reduxForm.controls[input.name].isTouched)">
      <small [hidden]="!reduxForm.controls[input.name].errors[input.name]">
        {{reduxForm.controls[input.name].errors[input.name]}}
      </small>
      <small [hidden]="!reduxForm.controls[input.name].errors.required">
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
