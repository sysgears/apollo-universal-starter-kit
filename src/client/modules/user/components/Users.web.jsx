// Web only component

// React
import React from 'react';
import Helmet from 'react-helmet';
import PageLayout from '../../../app/PageLayout';

import UsersFilter from '../containers/UsersFilter';
import UsersList from '../containers/UsersList';

const Users = () => {
  const renderMetaData = () => (
    <Helmet
      title="Users"
      meta={[
        {
          name: 'description',
          content: 'Users page'
        }
      ]}
    />
  );

  return (
    <PageLayout>
      {renderMetaData()}
      <h2>Users</h2>
      <UsersFilter />
      <hr />
      <UsersList />
    </PageLayout>
  );
};

export default Users;
