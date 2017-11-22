import { Component, Input } from '@angular/core';
import { FormInput } from './Form';

@Component({
  selector: 'render-select',
  template: `
    <label for="{{input.id}}">{{input.label}}</label>
    <select id="{{input.id}}"
            [ngrxFormControlState]="reduxForm.controls[input.name]"
            [ngrxEnableFocusTracking]="true"
            name="{{input.name}}"
            class="form-control"
            [(ngModel)]="reduxForm.value[input.name]">
      <option *ngFor="let o of input.options">{{o}}</option>
    </select>

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
