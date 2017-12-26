import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { assign, pick } from 'lodash';
import { FormGroupState } from 'ngrx-forms';
import { Subject } from 'rxjs/Subject';

import { settings } from '../../../../../settings';
import { AlertItem, createErrorAlert } from '../../common/components/Alert';
import { FormInput } from '../../ui-bootstrap/components/Form';
import { ItemType } from '../../ui-bootstrap/components/FormItem';
import { UserEditService } from '../containers/UserEdit';
import { FillUserFormAction, ResetUserFormAction, UserFormData, UserFormState } from '../reducers';

@Component({
  selector: 'users-edit-view',
  template: `
    <ausk-link [id]="back-button" [to]="'/users'" [type]>Back</ausk-link>
    <h1>{{title}}</h1>

    <alert [subject]="alertSubject"></alert>

    <ausk-form [onSubmit]="onSubmit"
               [formName]="'userForm'"
               [formState]="formState"
               [loading]="loading"
               [form]="form"
               [btnName]="'Save'">
    </ausk-form>
  `
})
export class UsersEditView implements OnInit, OnDestroy {
  public user: any = {};
  public loading: boolean = true;
  public title: string;
  public alertSubject: Subject<AlertItem> = new Subject<AlertItem>();
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
            errors.forEach((error: any) => this.alertSubject.next(createErrorAlert(error.message)));
            return;
          }
          this.router.navigateByUrl('users');
        }
      );
    } else {
      this.userEditService.addUser(insertValues, ({ data: { addUser: { errors, user } } }: any) => {
        if (errors) {
          errors.forEach((error: any) => this.alertSubject.next(createErrorAlert(error.message)));
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
        label: 'Username',
        placeholder: 'Username',
        inputType: ItemType.INPUT,
        minLength: 1,
        required: true
      },
      {
        id: 'email-input',
        name: 'email',
        value: 'Email',
        type: 'email',
        label: 'Email',
        placeholder: 'Email',
        inputType: ItemType.INPUT,
        minLength: 3,
        required: true
      },
      {
        id: 'role-selector',
        name: 'role',
        value: 'Role',
        label: 'Role',
        inputType: ItemType.SELECTOR,
        options: ['user', 'admin'],
        required: true
      },
      {
        id: 'active-radio',
        name: 'isActive',
        value: 'Is Active',
        label: 'Is Active',
        inputType: ItemType.RADIO_BUTTON,
        required: true
      },
      {
        id: 'first-name-input',
        name: 'firstName',
        value: 'First Name',
        type: 'text',
        label: 'First Name',
        placeholder: 'First Name',
        inputType: ItemType.INPUT,
        required: true
      },
      {
        id: 'last-name-input',
        name: 'lastName',
        value: 'Last Name',
        type: 'text',
        label: 'Last Name',
        placeholder: 'Last Name',
        inputType: ItemType.INPUT,
        required: true
      },
      {
        id: 'password-input',
        name: 'password',
        value: 'Password',
        type: 'password',
        label: 'Password',
        placeholder: 'Password',
        inputType: ItemType.INPUT,
        minLength: 5,
        required: withPassword
      },
      {
        id: 'passwordConfirmation-input',
        name: 'passwordConfirmation',
        value: 'Password Confirmation',
        type: 'password',
        label: 'Password Confirmation',
        placeholder: 'Password Confirmation',
        inputType: ItemType.INPUT,
        minLength: 5,
        required: withPassword
      }
    ];
  };
}
