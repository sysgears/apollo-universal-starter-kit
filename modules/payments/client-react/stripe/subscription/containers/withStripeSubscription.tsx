import React from 'react';
import { Query } from 'react-apollo';

import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';

export const withStripeSubscription = (Component: React.ComponentFactory<any, any>) => {
  const StripeSubscription = (props: any) => {
    return (
      <Query query={SUBSCRIPTION_QUERY} fetchPolicy="network-only">
        {({ loading, data }: any) =>
          loading ? null : <Component loading={loading} stripeSubscription={data.stripeSubscription} {...props} />
        }
      </Query>
    );
  };
  return StripeSubscription;
};
