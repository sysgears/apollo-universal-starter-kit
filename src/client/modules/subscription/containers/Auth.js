import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';

import { AuthNav } from '../../user/containers/Auth';

const SubscriberNav = ({ loading, active, children, ...rest }) => {
  return !loading && active ? <AuthNav {...rest}>{children}</AuthNav> : null;
};

SubscriberNav.propTypes = {
  active: PropTypes.bool.isRequired,
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

export default SubscriberNavWithApollo;
