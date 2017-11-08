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
      <user-form [onSubmit]="onSubmit" [user]="user" [loading]="loading"></user-form>
    </div>
  `
})
export default class UsersEditView implements OnInit, OnDestroy {
  public user: any = {};
  public loading: boolean = true;
  public title: string;

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

    this.userEditService.addUser(insertValues, ({ data: { addUser: { errors, user } } }: any) => {
      if (errors) {
      }
      this.router.navigateByUrl('users');
    });
  };
}

// import React from 'react';
// import PropTypes from 'prop-types';
// import Helmet from 'react-helmet';
// import { Link } from 'react-router-dom';
// import { SubmissionError } from 'redux-form';
// import { pick } from 'lodash';
//
// import { PageLayout } from '../../common/components/web';
// import UserForm from './UserForm';
// import settings from '../../../../../settings';
//
// class UserEditView extends React.PureComponent {
//   onSubmit = async values => {
//     const { user, addUser, editUser } = this.props;
//     let result = null;
//
//     let insertValues = pick(values, ['username', 'email', 'role', 'isActive', 'password']);
//
//     insertValues['profile'] = pick(values.profile, ['firstName', 'lastName']);
//
//     if (settings.user.auth.certificate.enabled) {
//       insertValues['auth'] = { certificate: pick(values.auth.certificate, 'serial') };
//     }
//
//     if (user) {
//       result = await editUser({ id: user.id, ...insertValues });
//     } else {
//       result = await addUser(insertValues);
//     }
//
//     if (result.errors) {
//       let submitError = {
//         _error: 'Edit user failed!'
//       };
//       result.errors.map(error => (submitError[error.field] = error.message));
//       throw new SubmissionError(submitError);
//     }
//   };
//
//   renderMetaData = () => (
//     <Helmet
//       title="Edit User"
//   meta={[
//     {
//       name: 'description',
//       content: 'Edit user example page'
//     }
//     ]}
// />
// );
//
//   render() {
//     const { loading, user } = this.props;
//
//     if (loading && !user) {
//       return (
//         <PageLayout>
//           {this.renderMetaData()}
//       <div className="text-center">Loading...</div>
//       </PageLayout>
//     );
//     } else {
//       return (
//         <PageLayout>
//           {this.renderMetaData()}
//       <Link id="back-button" to="/users">
//         Back
//         </Link>
//         <h2>{user ? 'Edit' : 'Create'} User</h2>
//       <UserForm onSubmit={this.onSubmit} initialValues={user} />
//       </PageLayout>
//     );
//     }
//   }
// }
//
// UserEditView.propTypes = {
//   loading: PropTypes.bool.isRequired,
//   user: PropTypes.object,
//   addUser: PropTypes.func.isRequired,
//   editUser: PropTypes.func.isRequired
// };
//
// export default UserEditView;
