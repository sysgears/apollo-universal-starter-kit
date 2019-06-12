import { useEffect, useState } from 'react';

import USERS_SUBSCRIPTION from '../graphql/UsersSubscription.graphql';

const useUsersWithSubscription = (subscribeToMore, filter) => {
  const [usersUpdated, setUsersUpdated] = useState(null);

  useEffect(() => {
    const subscribe = subscribeToUsers();
    return () => subscribe();
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

export default useUsersWithSubscription;
