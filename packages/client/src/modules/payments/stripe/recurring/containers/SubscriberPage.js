import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import SubscriberPageView from '../components/SubscriberPageView';
import translate from '../../../../../i18n';

import SUBSCRIBER_NUMBER_QUERY from '../graphql/SubscriptionProtectedNumberQuery.graphql';

const SubscriberPage = props => <SubscriberPageView {...props} />;

SubscriberPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  number: PropTypes.number
};

const SubscribersOnlyWithApollo = compose(
  graphql(SUBSCRIBER_NUMBER_QUERY, {
    options: { fetchPolicy: 'network-only' },
    props({ data: { loading, stripeSubscriptionProtectedNumber } }) {
      return {
        loading,
        subscriberNumber: stripeSubscriptionProtectedNumber && stripeSubscriptionProtectedNumber.number
      };
    }
  }),
  translate('subscription')
)(SubscriberPage);

export default SubscribersOnlyWithApollo;
