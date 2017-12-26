// React
import React from 'react';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import AccountView from '../components/AccountView';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';

class Account extends React.Component {
  render() {
    return <AccountView {...this.props} />;
  }
}

export default compose(
  graphql(CURRENT_USER_QUERY, {
    options: { fetchPolicy: 'network-only' },
    props({ data: { loading, error, currentUser } }) {
      if (error) {
        throw new Error(error);
      }
      return { loading, currentUser };
    }
  })
)(Account);
