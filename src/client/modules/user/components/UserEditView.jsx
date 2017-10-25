import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { PageLayout } from '../../common/components/web';
import UserForm from './UserForm';

class UserEditView extends React.PureComponent {
  state = {
    errors: []
  };

  onSubmit = async values => {
    const { user, addUser, editUser } = this.props;
    let result = null;

    if (user) {
      result = await editUser({ id: user.id, ...values });
    } else {
      result = await addUser(values);
    }

    if (result.errors) {
      this.setState({ errors: result.errors });
    }
  };

  renderMetaData = () => (
    <Helmet
      title="Apollo Starter Kit - Edit User"
      meta={[
        {
          name: 'description',
          content: 'Edit user example page'
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
          <UserForm onSubmit={this.onSubmit} initialValues={user} errors={this.state.errors} />
        </PageLayout>
      );
    }
  }
}

UserEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  addUser: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired
};

export default UserEditView;
