import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import PageLayout from '../../../app/PageLayout';
import UserForm from './UserForm';

const onSubmit = (user, addUser, editUser) => values => {
  if (user) {
    editUser(user.id, values.username, values.email, values.isAdmin, values.isActive);
  } else {
    addUser(values.username, values.email, values.isAdmin, values.isActive);
  }
};

const UserEditView = ({ loading, user, addUser, editUser }) => {
  const renderMetaData = () => (
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

  if (loading && !user) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">Loading...</div>
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        {renderMetaData()}
        <Link id="back-button" to="/users">
          Back
        </Link>
        <h2>{user ? 'Edit' : 'Create'} User</h2>
        <UserForm onSubmit={onSubmit(user, addUser, editUser)} initialValues={user} />
      </PageLayout>
    );
  }
};

UserEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  addUser: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired
};

export default UserEditView;
