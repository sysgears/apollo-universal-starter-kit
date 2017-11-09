import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormInput } from './UserEditView';

@Component({
  selector: 'user-form',
  template: `
    <div *ngIf="loading">Loading...</div>
    <form *ngIf="!loading && user" name="userForm" #userForm="ngForm" (ngSubmit)="onSubmit(user)">
      <div [ngClass]="{'form-group': fi.inputType !== 2, 'form-check': fi.inputType === 2}" *ngFor="let fi of form">

        <span *ngIf="fi.inputType === 0">
          <label for="{{fi.id}}">{{fi.value}}</label>
          <input id="{{fi.id}}"
                 type="{{fi.type}}"
                 class="form-control"
                 placeholder="{{fi.value}}"
                 name="{{fi.name}}"
                 [(ngModel)]="user[fi.name]"
                 #name="ngModel"
                 minlength="{{fi.minLength}}"
                 pattern="{{pattern(fi.name)}}"
                 [required]="fi.required" />

          <div *ngIf="name.invalid && (name.dirty || name.touched)">
            <small [hidden]="!name.errors.required">
              {{fi.value}} is required.
            </small>
            <small *ngIf="name.errors.minlength">
              Min length of the {{fi.value}} should be {{fi.minLength}}.
            </small>
            <small *ngIf="name.errors.pattern">
              {{patternMsg(fi.name)}}
            </small>
          </div>

        </span>

        <span *ngIf="fi.inputType === 1">
          <label for="{{fi.id}}">{{fi.value}}</label>
          <select id="fi.id" name="{{fi.name}}" class="form-control" [(ngModel)]="user[fi.name]" required>
            <option *ngFor="let o of fi.options">{{o}}</option>
          </select>
        </span>

        <span *ngIf="fi.inputType === 2">
          <label for="{{fi.id}}" class="form-check-label">
            <input type="checkbox" id="{{fi.id}}" name="{{fi.name}}" class="form-check-input" [(ngModel)]="user[fi.name]" />
            {{fi.value}}
          </label>
        </span>

      </div>
      <button type="submit" id="register-submit-btn" class="btn btn-primary" [disabled]="userForm.form.invalid">Save</button>
    </form>
  `,
  styles: ['small {color: brown}']
})
export default class UserForm implements OnInit, OnDestroy {
  @Input() public onSubmit: any;
  @Input() public loading: boolean;
  @Input() public user: any;
  @Input() public form: FormInput[];

  public pattern: any;
  public patternMsg: any;

  constructor() {
    this.pattern = this.getPattern;
    this.patternMsg = this.getPatternMsg;
  }

  public ngOnInit(): void {}

  public ngOnDestroy(): void {}

  // Some of the form patterns must be generalized and taken out of a form component
  private getPattern = (fieldName: string) => {
    let pat: any = null;

    if (fieldName === 'email') {
      pat = '^[a-zA-Z0–9_.+-]+@[a-zA-Z0–9-]+\\.[a-zA-Z0–9.]+$';
    }

    if (fieldName === 'passwordConfirmation') {
      pat = this.user.password || null;
    }

    return pat;
  };

  private getPatternMsg = (fieldName: string) => {
    let patMsg: string = null;

    if (fieldName === 'email') {
      patMsg = 'Email should be like john@doe.com';
    }

    if (fieldName === 'passwordConfirmation') {
      patMsg = 'Password confirmation should match to password';
    }

    return patMsg;
  };
}
