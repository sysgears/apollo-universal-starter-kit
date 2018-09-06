import React from 'react';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';

const SubscriptionAuthRouter = ({ component: Component, loader: Loader, ...props }: any) => {
  return (
    <Query query={SUBSCRIPTION_QUERY} fetchPolicy="network-only">
      {({ loading, data: { stripeSubscription } }) => {
        const { navigation, history } = props;

        if (loading) {
          return null;
        } else if (!loading && stripeSubscription && stripeSubscription.active) {
          return <Component {...props} />;
        } else {
          if (history) {
            history.push('/subscription');
            return <Loader />;
          }

          if (navigation) {
            navigation.push('Subscription');
            return <Loader />;
          }
        }
      }}
    </Query>
  );
};

export { SubscriptionAuthRouter };
