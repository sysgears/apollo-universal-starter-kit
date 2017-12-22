import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormInput } from './Form';

@Component({
  selector: 'render-field',
  template: `
    <label *ngIf="input.label" for="{{input.id}}">{{ input.label }}</label>
    <input id="{{input.id}}"
           type="{{input.type}}"
           [ngrxFormControlState]="reduxForm.controls[input.name]"
           [ngrxEnableFocusTracking]="true"
           name="{{input.name}}"
           class="form-control"
           placeholder="{{input.placeholder}}"
           (ngModelChange)="changed({ id: input.id, value: $event })"
           [(ngModel)]="reduxForm?.value[input.name]"/>

    <div *ngIf="reduxForm.controls[input.name].isInvalid && (reduxForm.controls[input.name].isDirty || reduxForm.controls[input.name].isTouched)">
      <small [hidden]="!reduxForm.controls[input.name].errors[input.name]">
        {{ reduxForm.controls[input.name].errors[input.name] }}
      </small>
      <small [hidden]="!reduxForm.controls[input.name].errors.required">
        {{ input.value }} is required
      </small>
    </div>
  `,
  styles: ['small {color: brown}']
})
export class RenderField {
  @Input() public input: FormInput;
  @Input() public reduxForm: any;
  @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  public changed = (e: any) => {
    this.onChange.emit(e);
  };
}
