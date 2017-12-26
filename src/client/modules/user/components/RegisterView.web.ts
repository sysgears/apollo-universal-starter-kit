import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Subject } from 'rxjs/Subject';

import { AlertItem, createErrorAlert } from '../../common/components/Alert';
import { FormInput } from '../../ui-bootstrap/components/Form';
import { ItemType } from '../../ui-bootstrap/components/FormItem';
import { RegisterService } from '../containers/Register';
import { RegisterFormData, RegisterFormState } from '../reducers';

@Component({
  selector: 'register-view',
  template: `
    <layout-center>
      <h1 class="text-center">Sign Up</h1>

      <alert [subject]="alertSubject"></alert>

      <ausk-form [onSubmit]="onSubmit"
                 [formName]="'registerForm'"
                 [formState]="formState"
                 [form]="form"
                 [btnName]="'Register'"
                 [btnAlign]="'center'">
      </ausk-form>
    </layout-center>
  `
})
export class RegisterView {
  public alertSubject: Subject<AlertItem> = new Subject<AlertItem>();
  public formState: FormGroupState<RegisterFormData>;
  public form: FormInput[];

  constructor(
    private registerService: RegisterService,
    private router: Router,
    private store: Store<RegisterFormState>
  ) {
    this.form = this.createForm();
    store.select(s => s.registerForm).subscribe((res: any) => {
      this.formState = res;
    });
  }

  public onSubmit = (regInputs: any) => {
    const { username, email, password } = regInputs;
    this.registerService.register(username, email, password, ({ data: { register } }: any) => {
      if (register.errors) {
        register.errors.forEach((error: any) => this.alertSubject.next(createErrorAlert(error.message)));
        return;
      }
      this.router.navigateByUrl('login');
    });
  };

  private createForm = (): FormInput[] => {
    return [
      {
        id: 'username-input',
        name: 'username',
        value: 'Username',
        type: 'text',
        label: 'Username',
        placeholder: 'Username',
        inputType: ItemType.INPUT,
        minLength: 3
      },
      {
        id: 'email-input',
        name: 'email',
        value: 'Email',
        type: 'email',
        label: 'Email',
        placeholder: 'Email',
        inputType: ItemType.INPUT,
        minLength: 1
      },
      {
        id: 'password-input',
        name: 'password',
        value: 'Password',
        type: 'password',
        label: 'Password',
        placeholder: 'Password',
        inputType: ItemType.INPUT,
        minLength: 5
      },
      {
        id: 'passwordConfirmation-input',
        name: 'passwordConfirmation',
        value: 'Password Confirmation',
        type: 'password',
        label: 'Password Confirmation',
        placeholder: 'Password Confirmation',
        inputType: ItemType.INPUT,
        minLength: 5
      }
    ];
  };
}
