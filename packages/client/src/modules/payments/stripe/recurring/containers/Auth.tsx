import React from 'react';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';

const SubscriptionAuthRouter = ({ component: Component, ...props }: any) => {
  return (
    <Query query={SUBSCRIPTION_QUERY}>
      {({ loading, data: { stripeSubscription } }) => {
        if (loading) {
          return <div>Loading...</div>; // TODO: internationalisation
        } else if (!loading && stripeSubscription && stripeSubscription.active) {
          return <Component {...props} />;
        } else {
          return <Redirect to="/subscription" />;
        }
      }}
    </Query>
  );
};

export { SubscriptionAuthRouter };
