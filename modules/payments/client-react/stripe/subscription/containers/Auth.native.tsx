import React, { ComponentType, useEffect } from 'react';

import { withStripeSubscription } from './withStripeSubscription';

interface SubscriptionAuthRouterProps {
  navigation: any;
  component: ComponentType;
  loading: boolean;
  stripeSubscription: {
    active: boolean;
  };
}

/**
 * SubscriptionAuthRouter protects routes only for users with subscription,
 * redirect to add subscription screen otherwise.
 */
const SubscriptionAuthRouter = (props: SubscriptionAuthRouterProps) => {
  const { component: Component, loading, navigation, stripeSubscription, ...restProps } = props;

  useEffect(() => {
    if (!loading && stripeSubscription && !stripeSubscription.active && navigation) {
      navigation.push('AddSubscription');
    }
  });

  return !loading && stripeSubscription && stripeSubscription.active ? <Component {...restProps} /> : null;
};

export default withStripeSubscription(SubscriptionAuthRouter);
