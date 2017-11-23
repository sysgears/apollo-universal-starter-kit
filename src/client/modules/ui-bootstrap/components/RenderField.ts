import { Component, Input } from '@angular/core';
import { FormInput } from './Form';

@Component({
  selector: 'render-field',
  template: `
    <label *ngIf="input.label" for="{{input.id}}">{{input.label}}</label>
    <input id="{{input.id}}"
           type="{{input.type}}"
           [ngrxFormControlState]="reduxForm.controls[input.name]"
           [ngrxEnableFocusTracking]="true"
           name="{{input.name}}"
           class="form-control"
           placeholder="{{input.placeholder}}"
           [(ngModel)]="reduxForm.value[input.name]"/>

    <div *ngIf="reduxForm.controls[input.name].isInvalid && (reduxForm.controls[input.name].isDirty || reduxForm.controls[input.name].isTouched)">
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
  @Input() private input: FormInput;
  @Input() private reduxForm: any;

  constructor() {}
}
