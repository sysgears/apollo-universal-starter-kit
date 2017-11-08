import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import UsersListService from '../containers/UsersList';
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
  styles: [
    `
      th > a {
          cursor: pointer;
      }
  `
  ]
})
export default class UsersListView implements OnInit, OnDestroy {
  public subscription: Subscription;
  public subsOnLoad: Subscription;
  public subsOnDelete: Subscription;
  public searchText: string;
  public role: string;
  public isActive: boolean;
  public orderBy: any;
  public loading: boolean = true;
  public errors: any = [];
  public users: any = [];

  constructor(private store: Store<any>, private usersListService: UsersListService, private ngZone: NgZone) {}

  public ngOnInit(): void {
    this.subscription = this.store.select('userStore').subscribe(({ searchText, role, isActive, orderBy }) => {
      this.searchText = searchText;
      this.role = role;
      this.isActive = isActive;
      this.orderBy = orderBy;
      this.fetchUsers(orderBy, searchText, role, isActive);
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe(this.subscription, this.subsOnLoad, this.subsOnDelete);
  }

  public fetchUsers(orderBy: any, searchText: string, role: string, isActive: boolean) {
    this.unsubscribe(this.subsOnLoad);
    this.subsOnLoad = this.usersListService
      .getUsers(orderBy, searchText, role, isActive)
      .subscribe(({ data, loading }: any) => {
        this.ngZone.run(() => {
          this.users = data ? data.users : [];
          this.loading = loading;
        });
      });
  }

  public handleDeleteUser = async (id: number) => {
    this.unsubscribe(this.subsOnDelete);
    this.subsOnDelete = this.usersListService
      .deleteUser(id)
      .subscribe(({ data: { deleteUser: { errors, user } } }: any) => {
        if (errors) {
          this.errors = errors;
        }
      });
  };

  public renderOrderByArrow = (name: string) => {
    return this.orderBy && this.orderBy.column === name
      ? `<span className="badge badge-primary">${this.orderBy.order === 'desc' ? '&#8595;' : '&#8593;'}</span>`
      : `<span className="badge badge-secondary">&#8645;</span>`;
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
      }
    });
  };
}

// import React from 'react';
// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
// import { Table, Button } from '../../common/components/web';
//
// class UsersView extends React.PureComponent {
//   state = {
//     errors: []
//   };
//
//   hendleDeleteUser = async id => {
//     const { deleteUser } = this.props;
//     const result = await deleteUser(id);
//     if (result && result.errors) {
//       this.setState({ errors: result.errors });
//     } else {
//       this.setState({ errors: [] });
//     }
//   };
//
//   renderOrderByArrow = name => {
//     const { orderBy } = this.props;
//
//     if (orderBy && orderBy.column === name) {
//       if (orderBy.order === 'desc') {
//         return <span className="badge badge-primary">&#8595;</span>;
//       } else {
//         return <span className="badge badge-primary">&#8593;</span>;
//       }
//     } else {
//       return <span className="badge badge-secondary">&#8645;</span>;
//     }
//   };
//
//   orderBy = (e, name) => {
//     const { onOrderBy, orderBy } = this.props;
//
//     e.preventDefault();
//
//     let order = 'asc';
//     if (orderBy && orderBy.column === name) {
//       if (orderBy.order === 'asc') {
//         order = 'desc';
//       } else if (orderBy.order === 'desc') {
//         return onOrderBy({});
//       }
//     }
//
//     return onOrderBy({ column: name, order });
//   };
//
//   render() {
//     const { loading, users } = this.props;
//     const { errors } = this.state;
//
//     const columns = [
//       {
//         title: (
//           <a onClick={e => this.orderBy(e, 'username')} href="#">
//       Username {this.renderOrderByArrow('username')}
//     </a>
//   ),
//     dataIndex: 'username',
//       key: 'username',
//       render: (text, record) => (
//       <Link className="user-link" to={`/users/${record.id}`}>
//     {text}
//     </Link>
//   )
//   },
//     {
//       title: (
//         <a onClick={e => this.orderBy(e, 'email')} href="#">
//       Email {this.renderOrderByArrow('email')}
//       </a>
//     ),
//       dataIndex: 'email',
//         key: 'email'
//     },
//     {
//       title: (
//         <a onClick={e => this.orderBy(e, 'role')} href="#">
//       Role {this.renderOrderByArrow('role')}
//       </a>
//     ),
//       dataIndex: 'role',
//         key: 'role'
//     },
//     {
//       title: (
//         <a onClick={e => this.orderBy(e, 'isActive')} href="#">
//       Is Active {this.renderOrderByArrow('isActive')}
//       </a>
//     ),
//       dataIndex: 'isActive',
//         key: 'isActive',
//       render: text => text.toString()
//     },
//     {
//       title: 'Actions',
//         key: 'actions',
//       render: (text, record) => (
//       <Button color="primary" size="sm" onClick={() => this.hendleDeleteUser(record.id)}>
//       Delete
//       </Button>
//     )
//     }
//   ];
//
//     if (loading && !users) {
//       return <div className="text-center">Loading...</div>;
//     } else {
//       return (
//         <div>
//           {errors &&
//         errors.map(error => (
//           <div className="alert alert-danger" role="alert" key={error.field}>
//       {error.message}
//       </div>
//     ))}
//       <Table dataSource={users} columns={columns} />
//       </div>
//     );
//     }
//   }
// }
//
// UsersView.propTypes = {
//   loading: PropTypes.bool.isRequired,
//   users: PropTypes.array,
//   orderBy: PropTypes.object,
//   onOrderBy: PropTypes.func.isRequired,
//   deleteUser: PropTypes.func.isRequired
// };
//
// export default UsersView;
