import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import SubscribersOnlyView from '../components/SubscribersOnlyView';

import NUMBER_QUERY from '../graphql/SubscribersOnlyNumberQuery.graphql';

const SubscribersOnly = ({ loading, number }) => <SubscribersOnlyView loading={loading} number={number} />;

SubscribersOnly.propTypes = {
  loading: PropTypes.bool.isRequired,
  number: PropTypes.number
};

const SubscribersOnlyWithApollo = compose(
  graphql(NUMBER_QUERY, {
    options: { fetchPolicy: 'network-only' },
    props({ data: { loading, subscribersOnlyNumber } }) {
      return { loading, number: subscribersOnlyNumber && subscribersOnlyNumber.number };
    }
  })
)(SubscribersOnly);

export default SubscribersOnlyWithApollo;
