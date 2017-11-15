import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { assign, pick } from 'lodash';
import { FormGroupState } from 'ngrx-forms';
import settings from '../../../../../settings';
import UserEditService from '../containers/UserEdit';
import { FillUserFormAction, ResetUserFormAction, UserFormData, UserFormState } from '../reducers/index';

export enum InputType {
  INPUT = 0,
  SELECTOR = 1,
  RADIO_BUTTON = 2
}

export interface FormInput {
  id: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  inputType: InputType;
  options?: any[];
  minLength?: number;
  required?: boolean;
}

@Component({
  selector: 'users-edit-view',
  template: `
    <div id="content" class="container">
      <a id="back-button" routerLink="/users">Back</a>
      <h1>{{title}}</h1>

      <div *ngIf="errors">
        <div *ngFor="let error of errors" class="alert alert-danger" role="alert" [id]="error.field">
          {{error.message}}
        </div>
      </div>

      <user-form [onSubmit]="onSubmit" [formState]="formState" [loading]="loading" [form]="form"></user-form>
    </div>
  `
})
export default class UsersEditView implements OnInit, OnDestroy {
  public user: any = {};
  public loading: boolean = true;
  public title: string;
  public errors: any[] = [];
  public formState: FormGroupState<UserFormData>;
  public form: FormInput[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userEditService: UserEditService,
    private ngZone: NgZone,
    private store: Store<UserFormState>
  ) {
    store.select(s => s.userForm).subscribe((res: any) => {
      this.formState = res;
    });
  }

  public ngOnInit(): void {
    this.route.params.subscribe((p: any) => {
      this.userEditService.user(p.id, ({ data: { user }, loading }: any) => {
        this.ngZone.run(() => {
          this.user = user ? assign({}, user, user.profile) : {};
          this.form = this.createForm(Number(p.id) === 0);
          this.loading = loading;
          this.title = user ? 'Edit User' : 'Create User';
          const action = user
            ? new FillUserFormAction(
                assign(
                  {},
                  pick(user, ['username', 'email', 'role', 'isActive']),
                  pick(user.profile, ['firstName', 'lastName']),
                  { password: '', passwordConfirmation: '' } as any
                )
              )
            : new ResetUserFormAction();
          this.store.dispatch(action);
        });
      });
    });
  }

  public ngOnDestroy(): void {}

  public onSubmit = (form: any) => {
    const insertValues: any = pick(form, ['username', 'email', 'role', 'isActive', 'password']);
    insertValues.profile = pick(form, ['firstName', 'lastName']);

    if (settings.user.auth.certificate.enabled) {
      insertValues.auth = { certificate: pick(form.auth.certificate, 'serial') };
    }

    if (this.user.id) {
      this.userEditService.editUser(
        { id: this.user.id, ...insertValues },
        ({ data: { editUser: { errors, user } } }: any) => {
          if (errors) {
            this.errors = errors;
            return;
          }
          this.router.navigateByUrl('users');
        }
      );
    } else {
      this.userEditService.addUser(insertValues, ({ data: { addUser: { errors, user } } }: any) => {
        if (errors) {
          this.errors = errors;
          return;
        }
        this.router.navigateByUrl('users');
      });
    }
  };

  private createForm = (withPassword: boolean) => {
    return [
      {
        id: 'username-input',
        name: 'username',
        value: 'Username',
        type: 'text',
        placeholder: 'Username',
        inputType: InputType.INPUT,
        minLength: 1,
        required: true
      },
      {
        id: 'email-input',
        name: 'email',
        value: 'Email',
        type: 'email',
        placeholder: 'Email',
        inputType: InputType.INPUT,
        minLength: 3,
        required: true
      },
      {
        id: 'role-selector',
        name: 'role',
        value: 'Role',
        inputType: InputType.SELECTOR,
        options: ['user', 'admin'],
        required: true
      },
      {
        id: 'active-radio',
        name: 'isActive',
        value: 'Is Active',
        inputType: InputType.RADIO_BUTTON,
        required: true
      },
      {
        id: 'first-name-input',
        name: 'firstName',
        value: 'First Name',
        type: 'text',
        placeholder: 'First Name',
        inputType: InputType.INPUT,
        required: true
      },
      {
        id: 'last-name-input',
        name: 'lastName',
        value: 'Last Name',
        type: 'text',
        placeholder: 'Last Name',
        inputType: InputType.INPUT,
        required: true
      },
      {
        id: 'password-input',
        name: 'password',
        value: 'Password',
        type: 'password',
        placeholder: 'Password',
        inputType: InputType.INPUT,
        minLength: 5,
        required: withPassword
      },
      {
        id: 'passwordConfirmation-input',
        name: 'passwordConfirmation',
        value: 'Password Confirmation',
        type: 'password',
        placeholder: 'Password Confirmation',
        inputType: InputType.INPUT,
        minLength: 5,
        required: withPassword
      }
    ];
  };
}
