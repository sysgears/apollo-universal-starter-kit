import React from 'react';
import { graphql } from 'react-apollo';

import { compose } from '@gqlapp/core-common';

import ProfileView from '../components/ProfileView';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';

const Profile = props => <ProfileView {...props} />;

export default compose(
  graphql(CURRENT_USER_QUERY, {
    props({ data: { loading, error, currentUser } }) {
      if (error) throw new Error(error);
      return { loading, currentUser };
    }
  })
)(Profile);
