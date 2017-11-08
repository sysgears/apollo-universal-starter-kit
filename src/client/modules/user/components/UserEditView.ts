import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { assign, pick } from 'lodash';
import settings from '../../../../../settings';
import UserEditService from '../containers/UserEdit';

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

      <user-form [onSubmit]="onSubmit" [user]="user" [loading]="loading"></user-form>
    </div>
  `
})
export default class UsersEditView implements OnInit, OnDestroy {
  public user: any = {};
  public loading: boolean = true;
  public title: string;
  public errors: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userEditService: UserEditService,
    private ngZone: NgZone
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe((p: any) => {
      this.userEditService.user(p.id, ({ data: { user }, loading }: any) => {
        this.ngZone.run(() => {
          this.user = user ? assign({}, user, user.profile) : {};
          this.loading = loading;
          this.title = user ? 'Edit User' : 'Create User';
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
}
