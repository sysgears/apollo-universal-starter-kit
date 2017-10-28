import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { Route, Redirect } from 'react-router-dom';

import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';

import { AuthNav, AuthRoute } from '../../user/containers/Auth';

const SubscriberNav = ({ loading, active, children, ...rest }) => {
  return !loading && active ? <AuthNav {...rest}>{children}</AuthNav> : null;
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

const SubscriberRoute = ({ loading, active, component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (loading) {
          return <p>Loading...</p>;
        }
        return active ? <AuthRoute component={component} {...props} /> : <Redirect to={{ pathname: '/login' }} />;
      }}
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
