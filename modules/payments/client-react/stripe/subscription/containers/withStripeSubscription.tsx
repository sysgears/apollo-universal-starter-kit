import React, { ComponentType } from 'react';
import { Query } from 'react-apollo';

import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';

export const withStripeSubscription = (Component: ComponentType) => {
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
