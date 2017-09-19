// Web only component
// React
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { ListGroup, ListGroupItem } from 'reactstrap';

import PageLayout from '../../../app/PageLayout';

function renderUsers(users) {
  return users.map(({ id, username, email, isAdmin }) => {
    return (
      <ListGroupItem className="justify-content-between" key={id}>
        <span>{username}</span>
        <span>{email}</span>
        <span>{isAdmin.toString()}</span>
      </ListGroupItem>
    );
  });
}

const UsersView = ({ loading, users, errors }) => {
  const renderMetaData = () => (
    <Helmet
      title="User"
      meta={[
        {
          name: 'description',
          content: 'User page'
        }
      ]}
    />
  );

  if (loading) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">Loading...</div>
      </PageLayout>
    );
  } else if (errors) {
    return (
      <PageLayout>
        {renderMetaData()}
        <h2>Users</h2>
        <h1 />
        {errors.map(error => <li key={error.path[0]}>{error.message}</li>)}
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        {renderMetaData()}
        <h2>Users</h2>
        <h1 />
        <ListGroup>
          <ListGroupItem className="justify-content-between">
            <span>Username:</span>
            <span>Email:</span>
            <span>Is Admin:</span>
          </ListGroupItem>
          {renderUsers(users)}
        </ListGroup>
      </PageLayout>
    );
  }
};

UsersView.propTypes = {
  loading: PropTypes.bool.isRequired,
  users: PropTypes.array,
  errors: PropTypes.array
};

export default UsersView;
