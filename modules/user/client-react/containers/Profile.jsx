// React
import React from 'react';
import { Query } from 'react-apollo';
import authentication from '@gqlapp/authentication-client-react';
import ProfileView from '../components/ProfileView';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';

const logoutFromAllDevices = async client => {
  await authentication.doLogoutFromAllDevices(client);
};

const Profile = () => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data: { loading, error, currentUser }, client }) => {
      if (error) throw new Error(error);
      return (
        <ProfileView
          loading={loading}
          currentUser={currentUser}
          logoutFromAllDevices={() => logoutFromAllDevices(client)}
        />
      );
    }}
  </Query>
);

export default Profile;
