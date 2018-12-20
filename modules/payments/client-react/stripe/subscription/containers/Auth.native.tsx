import React, { ComponentType } from 'react';

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
class SubscriptionAuthRouter extends React.Component<SubscriptionAuthRouterProps> {
  public componentDidUpdate() {
    const { loading, navigation, stripeSubscription } = this.props;

    if (!loading && stripeSubscription && !stripeSubscription.active && navigation) {
      navigation.push('AddSubscription');
    }
  }

  public render() {
    const { component: Component, loading, stripeSubscription, ...props } = this.props;
    return !loading && stripeSubscription && stripeSubscription.active ? <Component {...props} /> : null;
  }
}

export default withStripeSubscription(SubscriptionAuthRouter);
