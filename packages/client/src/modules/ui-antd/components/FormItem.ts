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
      <render-field [input]="formInput" [reduxForm]="form"></render-field>
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
