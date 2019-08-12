import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Subscription } from 'react-apollo';

import USERS_SUBSCRIPTION from '../graphql/UsersSubscription.graphql';

export const useUsersWithSubscription = (subscribeToMore, filter) => {
  const [usersUpdated, setUsersUpdated] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToUsers();
    return () => unsubscribe();
  });

  const subscribeToUsers = () => {
    return subscribeToMore({
      document: USERS_SUBSCRIPTION,
      variables: { filter },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: { usersUpdated: newData }
          }
        }
      ) => {
        setUsersUpdated(newData);
      }
    });
  };

  return usersUpdated;
};

export default Component => {
  const UsersWithSubscription = props => {
    const { filter } = props;
    return (
      <Subscription subscription={USERS_SUBSCRIPTION} variables={{ filter }}>
        {({ data, loading }) => {
          if (!loading && data.usersUpdated) {
            return <Component {...props} usersUpdated={data.usersUpdated} />;
          }

          return <Component {...props} />;
        }}
      </Subscription>
    );
  };

  UsersWithSubscription.propTypes = {
    filter: PropTypes.object
  };

  return UsersWithSubscription;
};
