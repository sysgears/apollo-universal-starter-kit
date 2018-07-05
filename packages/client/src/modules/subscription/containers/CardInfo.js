import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import CardInfoView from '../components/CardInfoView';

import CARD_INFO_QUERY from '../graphql/CardInfoQuery.graphql';

const CardInfo = ({ loading, expiryMonth, expiryYear, last4, brand }) => {
  return (
    <CardInfoView loading={loading} expiryMonth={expiryMonth} expiryYear={expiryYear} last4={last4} brand={brand} />
  );
};

CardInfo.propTypes = {
  loading: PropTypes.bool.isRequired,
  expiryMonth: PropTypes.number,
  expiryYear: PropTypes.number,
  last4: PropTypes.string,
  brand: PropTypes.string
};

const CardInfoWithApollo = compose(
  graphql(CARD_INFO_QUERY, {
    options: { fetchPolicy: 'network-only' },
    props({ data: { loading, subscriptionCardInfo } }) {
      return {
        loading,
        expiryMonth: subscriptionCardInfo && subscriptionCardInfo.expiryMonth,
        expiryYear: subscriptionCardInfo && subscriptionCardInfo.expiryYear,
        last4: subscriptionCardInfo && subscriptionCardInfo.last4,
        brand: subscriptionCardInfo && subscriptionCardInfo.brand
      };
    }
  })
)(CardInfo);

export default CardInfoWithApollo;
