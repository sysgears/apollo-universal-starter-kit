import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { PageLayout, Button } from '../../common/components/web';

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
      <Link to="/users/0">
        <Button color="primary">Add</Button>
      </Link>
      <hr />
      <UsersFilter />
      <hr />
      <UsersList />
    </PageLayout>
  );
};

export default Users;
