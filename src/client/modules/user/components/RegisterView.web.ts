import { Component } from '@angular/core';
import { Router } from '@angular/router';
import RegisterService from '../containers/Register';

@Component({
  selector: 'register-view',
  template: `
    <div id="content" class="container">
      <h1>Register page!</h1>

      <div *ngIf="errors">
        <div *ngFor="let error of errors" class="alert alert-danger" role="alert" [id]="error.field">
          {{error.message}}
        </div>
      </div>

      <register-form [onSubmit]="onSubmit"></register-form>
    </div>
  `
})
export default class RegisterView {
  public errors: any[];

  constructor(private registerService: RegisterService, private router: Router) {}

  public onSubmit = (regInputs: any) => {
    const { username, email, password } = regInputs;
    this.registerService.register(username, email, password, ({ data: { register } }: any) => {
      if (register.errors) {
        this.errors = register.errors;
        return;
      }

      this.router.navigateByUrl('login');
    });
  };
}
