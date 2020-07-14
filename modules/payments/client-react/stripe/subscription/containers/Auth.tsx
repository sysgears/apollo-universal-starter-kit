import React, { ComponentType } from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { PageLayout } from '@gqlapp/look-client-react';

import { withStripeSubscription } from './withStripeSubscription';

interface SubscriptionAuthRouterProps {
  component: ComponentType;
  loading: boolean;
  stripeSubscription: {
    active: boolean;
  };
}

/**
 * SubscriptionAuthRouter protects routes only for users with subscription,
 * redirect to add subscription page otherwise.
 */
const SubscriptionAuthRouter = ({
  component: Component,
  loading,
  stripeSubscription,
  ...props
}: SubscriptionAuthRouterProps) => {
  // PageLayout must be used here to prevent showing
  // empty screen when stripe subscription info is loading
  // Important: You don't need to include page layout inside protected routes!
  return (
    <>
      <Helmet>
        <script src="https://js.stripe.com/v3/" type="text/javascript" />
      </Helmet>
      <PageLayout>
        {!loading && stripeSubscription && stripeSubscription.active ? (
          <Component {...props} />
        ) : !loading && stripeSubscription && !stripeSubscription.active ? (
          <Redirect to="/add-subscription" />
        ) : null}
      </PageLayout>
    </>
  );
};

export default withStripeSubscription(SubscriptionAuthRouter as any);
