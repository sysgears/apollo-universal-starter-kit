import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import SubscriberPageView from '../components/SubscriberPageView';

import SUBSCRIBER_NUMBER_QUERY from '../graphql/SubscriptionProtectedNumberQuery.graphql';

const SubscriberPage = ({ loading, number }) => <SubscriberPageView loading={loading} number={number} />;

SubscriberPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  number: PropTypes.number
};

const SubscribersOnlyWithApollo = compose(
  graphql(SUBSCRIBER_NUMBER_QUERY, {
    options: { fetchPolicy: 'network-only' },
    props({ data: { loading, stripeSubscriptionProtectedNumber } }) {
      return { loading, number: stripeSubscriptionProtectedNumber && stripeSubscriptionProtectedNumber.number };
    }
  })
)(SubscriberPage);

export default SubscribersOnlyWithApollo;
