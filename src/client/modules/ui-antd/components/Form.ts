import { Component, Input, OnInit } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';
import { ItemType } from './FormItem';

export interface FormInput {
  id: string;
  name: string;
  value: string;
  type?: string;
  label?: string;
  placeholder?: string;
  inputType: ItemType;
  options?: any[];
  minLength?: number;
  required?: boolean;
}

@Component({
  selector: 'ausk-form',
  template: `
    <div *ngIf="loading">Loading...</div>
    <form *ngIf="!loading" name="{{formName}}" (ngSubmit)="onSubmit(formState[formName].value)"
          [ngrxFormState]="formState">
      <div [ngClass]="{'form-group': fi.inputType !== 2, 'form-check': fi.inputType === 2}" *ngFor="let fi of form">

        <form-item [itemType]="fi.inputType"
                   [formInput]="fi"
                   [form]="formState[formName]">
        </form-item>

      </div>
      <div class="{{ btnAlign }}">
        <ausk-button type="submit" [disabled]="formState[formName].isInvalid || submitting">
          {{ btnName }}
        </ausk-button>
      </div>
    </form>
  `
})
export default class Form implements OnInit {
  @Input() public btnName: string;
  @Input() public btnAlign: string;
  @Input() public onSubmit: any;
  @Input() public loading: boolean;
  @Input() public submitting: boolean;
  @Input() public formName: string;
  @Input() public formState: FormGroupState<any>;
  @Input() public form: FormInput[];

  constructor() {}

  public ngOnInit(): void {
    this.btnAlign = this.btnAlign && this.btnAlign.match(/(left|center|right)/) ? `text-${this.btnAlign}` : 'text-left';
  }
}
