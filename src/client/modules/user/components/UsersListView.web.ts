import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import UsersListService, { AddUser, DeleteUser, UpdateUser } from '../containers/UsersList';
import { UserOrderBy } from '../reducers';

@Component({
  selector: 'users-list-view',
  template: `
    <div *ngIf="!loading; else showLoading">
      <div *ngIf="errors">
        <div *ngFor="let error of errors" class="alert alert-danger" role="alert" [id]="error.field">
          {{error.message}}
        </div>
      </div>
      <table class="table">
        <thead>
        <tr>
          <th *ngFor="let header of renderHeaders()">
            <a (click)="orderByColumn($event, header.value)">{{ header.name }} <span [innerHTML]="renderOrderByArrow(header.value)"></span>
            </a>
          </th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let user of users">
          <td>
            <a class="user-link" [routerLink]="['/users', user.id]">{{ user.username }}</a>
          </td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.isActive }}</td>
          <td>
            <button type="button" class="btn btn-primary btn-sm" (click)="handleDeleteUser(user.id)">Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <ng-template #showLoading>
      <div class="text-center">Loading...</div>
    </ng-template>
  `,
  styles: [`th > a {cursor: pointer;}`]
})
export default class UsersListView implements OnInit, OnDestroy {
  public searchText: string;
  public role: string;
  public isActive: boolean;
  public orderBy: any;
  public loading: boolean = true;
  public errors: any = [];
  public users: any = [];
  private subsOnStore: Subscription;
  private subsOnLoad: Subscription;
  private subsOnUpdate: Subscription;
  private subsOnDelete: Subscription;

  constructor(private store: Store<any>, private usersListService: UsersListService, private ngZone: NgZone) {}

  public ngOnInit(): void {
    this.subsOnStore = this.store.select('user').subscribe(({ searchText, role, isActive, orderBy }) => {
      this.searchText = searchText;
      this.role = role;
      this.isActive = isActive;
      this.orderBy = orderBy;
      this.fetchUsers(orderBy, searchText, role, isActive);
    });

    this.subsOnUpdate = this.usersListService.subscribeToUsers(
      ({ data: { usersUpdated: { mutation, node } } }: any) => {
        if (mutation === 'CREATED') {
          this.users = AddUser(this.users, node);
        } else if (mutation === 'UPDATED') {
          this.users = UpdateUser(this.users, node);
        } else if (mutation === 'DELETED') {
          this.users = DeleteUser(this.users, node.id);
        }
      }
    );

    this.usersListService.updateSubscription(this.subsOnUpdate);
  }

  public ngOnDestroy(): void {
    this.unsubscribe(this.subsOnStore, this.subsOnLoad, this.subsOnDelete);
  }

  public fetchUsers(orderBy: any, searchText: string, role: string, isActive: boolean) {
    this.unsubscribe(this.subsOnLoad);
    this.subsOnLoad = this.usersListService.getUsers(orderBy, searchText, role, isActive, ({ data, loading }: any) => {
      this.ngZone.run(() => {
        this.users = data ? data.users : [];
        this.loading = loading;
      });
    });
  }

  public handleDeleteUser = async (id: number) => {
    this.unsubscribe(this.subsOnDelete);
    this.subsOnDelete = this.usersListService.deleteUser(id, ({ data: { deleteUser: { errors } } }: any) => {
      this.errors = errors;
    });
  };

  public renderOrderByArrow = (name: string) => {
    return this.orderBy && this.orderBy.column === name
      ? `<span class="badge badge-primary">${this.orderBy.order === 'desc' ? '&#8595;' : '&#8593;'}</span>`
      : `<span class="badge badge-secondary">&#8645;</span>`;
  };

  public orderByColumn = (e: any, name: string) => {
    e.preventDefault();
    let order = 'asc';
    if (this.orderBy && this.orderBy.column === name) {
      if (this.orderBy.order === 'asc') {
        order = 'desc';
      } else if (this.orderBy.order === 'desc') {
        return this.store.dispatch(new UserOrderBy({}));
      }
    }
    return this.store.dispatch(new UserOrderBy({ column: name, order }));
  };

  public renderHeaders = () => {
    return [
      {
        name: 'Username',
        value: 'username'
      },
      {
        name: 'Email',
        value: 'email'
      },
      {
        name: 'Role',
        value: 'role'
      },
      {
        name: 'Is Active',
        value: 'isActive'
      }
    ];
  };

  private unsubscribe = (...subscriptions: Subscription[]) => {
    subscriptions.forEach((subscription: Subscription) => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
    });
  };
}
