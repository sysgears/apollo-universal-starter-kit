import { Component, Input } from '@angular/core';
import { FormInput } from './Form';

@Component({
  selector: 'render-checkbox',
  template: `
    <label for="{{input.id}}" class="form-check-label">
      <input type="checkbox"
             id="{{input.id}}"
             [ngrxFormControlState]="reduxForm.controls[input.name]"
             [ngrxEnableFocusTracking]="true"
             name="{{input.name}}"
             class="form-check-input"
             [(ngModel)]="reduxForm.value[input.name]" />
      {{input.label}}
    </label>

    <div *ngIf="reduxForm.controls[input.name].isInvalid && (reduxForm.controls[input.name].isDirty || reduxForm.controls[input.name].isTouched)">
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
  @Input() private input: FormInput;
  @Input() private reduxForm: any;

  constructor() {}
}
