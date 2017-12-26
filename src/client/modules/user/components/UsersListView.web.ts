import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { AlertItem, createErrorAlert } from '../../common/components/Alert';
import { CellData, ColumnData, ElemType } from '../../ui-bootstrap/components/Table';
import { UsersListService, AddUser, DeleteUser, UpdateUser } from '../containers/UsersList';
import { UserOrderBy } from '../reducers';

@Component({
  selector: 'users-list-view',
  template: `
    <div *ngIf="!loading; else showLoading">

      <alert [subject]="alertSubject"></alert>

      <ausk-table
          [columns]="columns"
          [rows]="rows">
      </ausk-table>

    </div>

    <ng-template #showLoading>
      <div class="text-center">Loading...</div>
    </ng-template>
  `,
  styles: [
    `th > a {
      cursor: pointer;
  }`
  ]
})
export class UsersListView implements OnInit, OnDestroy {
  public searchText: string;
  public role: string;
  public isActive: boolean;
  public orderBy: any;
  public loading: boolean = true;
  public alertSubject: Subject<AlertItem> = new Subject<AlertItem>();
  public users: any = [];

  private subsOnStore: Subscription;
  private subsOnLoad: Subscription;
  private subsOnUpdate: Subscription;
  private subsOnDelete: Subscription;

  private rows: CellData[];
  public columns: ColumnData[] = [
    {
      title: 'Username',
      value: 'username',
      sorting: (e: any, name: string) => this.orderByColumn(e, name),
      iconRender: (name: string) => this.renderOrderByArrow(name)
    },
    {
      title: 'Email',
      value: 'email',
      sorting: (e: any, name: string) => this.orderByColumn(e, name),
      iconRender: (name: string) => this.renderOrderByArrow(name)
    },
    {
      title: 'Role',
      value: 'role',
      sorting: (e: any, name: string) => this.orderByColumn(e, name),
      iconRender: (name: string) => this.renderOrderByArrow(name)
    },
    {
      title: 'Is Active',
      value: 'isActive',
      sorting: (e: any, name: string) => this.orderByColumn(e, name),
      iconRender: (name: string) => this.renderOrderByArrow(name)
    },
    {
      title: 'Actions'
    }
  ];

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

        this.rows = this.users.map((user: any) => {
          return [
            {
              type: ElemType.Link,
              text: user.username,
              link: `/users/${user.id}`
            },
            {
              type: ElemType.Text,
              text: user.email
            },
            {
              type: ElemType.Text,
              text: user.role
            },
            {
              type: ElemType.Text,
              text: user.isActive
            },
            {
              type: ElemType.Button,
              text: 'Delete',
              callback: () => this.handleDeleteUser(user.id)
            }
          ];
        });
      });
    });
  }

  public handleDeleteUser = async (id: number) => {
    this.unsubscribe(this.subsOnDelete);
    this.subsOnDelete = this.usersListService.deleteUser(id, ({ data: { deleteUser: { errors } } }: any) => {
      errors.forEach((error: any) => this.alertSubject.next(createErrorAlert(error.message)));
    });
  };

  public renderOrderByArrow = (name: string) => {
    return this.orderBy && this.orderBy.column === name
      ? `<span class="badge badge-primary">${this.orderBy.order === 'desc' ? '&#8595;' : '&#8593;'}</span>`
      : '<span class="badge badge-secondary">&#8645;</span>';
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

  private unsubscribe = (...subscriptions: Subscription[]) => {
    subscriptions.forEach((subscription: Subscription) => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
    });
  };
}
