import React from 'react';
import { Query } from 'react-apollo';

import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';

export const withStripeSubscription = (Component: any) => {
  return (props: any) => {
    return (
      <Query query={SUBSCRIPTION_QUERY} fetchPolicy="network-only">
        {({ loading, data: { stripeSubscription } }: any) => (
          <Component loading={loading} stripeSubscription={stripeSubscription} {...props} />
        )}
      </Query>
    );
  };
};
