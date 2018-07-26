import React from 'react';
import PropTypes from 'prop-types';
import { Subscription } from 'react-apollo';
import update from 'immutability-helper';

import USERS_SUBSCRIPTION from '../graphql/UsersSubscription.graphql';
import USERS_QUERY from '../graphql/UsersQuery.graphql';

export default Component => {
  return class UsersWithSubscription extends React.Component {
    static propTypes = {
      filter: PropTypes.object,
      orderBy: PropTypes.object,
      client: PropTypes.object
    };

    render() {
      const { client, orderBy, filter } = this.props;
      return (
        <Subscription subscription={USERS_SUBSCRIPTION} variables={{ filter }}>
          {({ data, loading }) => {
            if (!loading) {
              const {
                usersUpdated: { mutation, node }
              } = data;
              let cachedUsers = client.readQuery({ query: USERS_QUERY, variables: { orderBy, filter } });

              switch (mutation) {
                case 'CREATED':
                  cachedUsers = addUser(cachedUsers, node);
                  break;
                case 'DELETED':
                  cachedUsers = deleteUser(cachedUsers, node.id);
                  break;
                case 'UPDATED':
                  cachedUsers = deleteUser(cachedUsers, node.id);
                  break;
                default:
                  return <Component {...this.props} />;
              }

              client.writeQuery({ query: USERS_QUERY, data: cachedUsers });

              return <Component {...this.props} users={cachedUsers.users} />;
            }

            return <Component {...this.props} />;
          }}
        </Subscription>
      );
    }
  };
};

function addUser(prev, node) {
  return update(prev, {
    users: {
      $set: [...prev.users, node]
    }
  });
}

function deleteUser(prev, id) {
  const index = prev.users.findIndex(user => user.id === id);
  // ignore if not found
  if (index < 0) {
    return prev;
  }
  return update(prev, {
    users: {
      $splice: [[index, 1]]
    }
  });
}
