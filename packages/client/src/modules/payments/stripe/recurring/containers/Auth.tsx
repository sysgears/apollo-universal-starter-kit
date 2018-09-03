import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';

import { AuthRoute } from '../../../../user';

const SubscribeRedirect = () => <Redirect to="/subscription" />;
const SubscribeLoading = () => <div>Loading...</div>;

const SubscriberRoute = ({ component, ...rest }) => (
  <Query query={SUBSCRIPTION_QUERY}>
    {({ loading, data }) => {
      const { stripeSubscription } = data;
      const active = stripeSubscription && stripeSubscription.active;

      return (
        <AuthRoute
          component={loading ? SubscribeLoading : !loading && active ? component : SubscribeRedirect}
          role="user"
          {...rest}
          redirect={'/login'}
        />
      );
    }}
  </Query>
);

SubscriberRoute.propTypes = {
  component: PropTypes.func
};

export default SubscriberRoute;
