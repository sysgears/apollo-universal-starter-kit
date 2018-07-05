import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { Redirect, NavLink } from 'react-router-dom';

import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';

import { IfLoggedIn, AuthRoute } from '../../user';

const SubscriberNav = ({ loading, active, children, ...rest }) => {
  return (
    <IfLoggedIn>
      <NavLink {...rest}>{loading || !active ? null : children}</NavLink>
    </IfLoggedIn>
  );
};

SubscriberNav.propTypes = {
  active: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  children: PropTypes.object
};

const SubscriberNavWithApollo = compose(
  graphql(SUBSCRIPTION_QUERY, {
    props: ({ data }) => {
      const { loading, subscription } = data;
      return {
        loading,
        active: subscription && subscription.active
      };
    }
  })
)(SubscriberNav);

const SubscribeRedirect = () => <Redirect to="/subscription" />;

const LoadingComponent = () => <div>Loading...</div>;

const SubscriberRoute = ({ loading, active, component, ...rest }) => {
  return (
    <AuthRoute
      component={loading ? LoadingComponent : !loading && active ? component : SubscribeRedirect}
      role="user"
      {...rest}
      redirect={'/login'}
    />
  );
};

SubscriberRoute.propTypes = {
  component: PropTypes.func,
  loading: PropTypes.bool.isRequired,
  active: PropTypes.bool
};

const SubscriberRouteWithApollo = compose(
  graphql(SUBSCRIPTION_QUERY, {
    props: ({ data }) => {
      const { loading, subscription } = data;
      return {
        loading,
        active: subscription && subscription.active
      };
    }
  })
)(SubscriberRoute);

export { SubscriberNavWithApollo as SubscriberNav };
export { SubscriberRouteWithApollo as SubscriberRoute };
