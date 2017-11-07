import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import CancelSubscriptionView from '../components/CancelSubscriptionView';

import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';

const CancelSubscription = ({ loading, active }) => {
  return <CancelSubscriptionView loading={loading} active={active} />;
};

CancelSubscription.propTypes = {
  loading: PropTypes.bool.isRequired,
  active: PropTypes.bool
};

const CancelSubscriptionWithApollo = compose(
  graphql(SUBSCRIPTION_QUERY, {
    props({ data: { loading, subscription } }) {
      return {
        loading,
        active: subscription && subscription.active
      };
    }
  })
)(CancelSubscription);

export default CancelSubscriptionWithApollo;
