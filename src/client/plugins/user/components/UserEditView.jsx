import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { SubmissionError } from 'redux-form';
import { pick } from 'lodash';
import { PageLayout } from '../../common/components/web';

import UserForm from './UserForm';
import settings from '../../../../../settings';

export default class UserEditView extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object,
    addUser: PropTypes.func.isRequired,
    editUser: PropTypes.func.isRequired
  };

  onSubmit = async values => {
    const { user, addUser, editUser } = this.props;
    let result = null;

    let insertValues = pick(values, ['username', 'email', 'role', 'isActive', 'password']);

    insertValues['profile'] = pick(values.profile, ['firstName', 'lastName']);

    if (settings.user.auth.certificate.enabled) {
      insertValues['auth'] = { certificate: pick(values.auth.certificate, 'serial') };
    }

    if (user) {
      result = await editUser({ id: user.id, ...insertValues });
    } else {
      result = await addUser(insertValues);
    }

    if (result.errors) {
      let submitError = {
        _error: 'Edit user failed!'
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw new SubmissionError(submitError);
    }
  };

  renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - Edit User`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - Edit user example page`
        }
      ]}
    />
  );

  render() {
    const { loading, user } = this.props;

    if (loading && !user) {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <div className="text-center">Loading...</div>
        </PageLayout>
      );
    } else {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <Link id="back-button" to="/users">
            Back
          </Link>
          <h2>{user ? 'Edit' : 'Create'} User</h2>
          <UserForm onSubmit={this.onSubmit} initialValues={user} />
        </PageLayout>
      );
    }
  }
}
