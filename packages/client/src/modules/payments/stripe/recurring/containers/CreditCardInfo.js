import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import CreditCardInfoView from '../components/CreditCardInfoView';

import CREDIT_CARD_QUERY from '../graphql/CreditCardQuery.graphql';

const CreditCardInfo = ({ loading, expiryMonth, expiryYear, last4, brand }) => {
  return (
    <CreditCardInfoView
      loading={loading}
      expiryMonth={expiryMonth}
      expiryYear={expiryYear}
      last4={last4}
      brand={brand}
    />
  );
};

CreditCardInfo.propTypes = {
  loading: PropTypes.bool.isRequired,
  expiryMonth: PropTypes.number,
  expiryYear: PropTypes.number,
  last4: PropTypes.string,
  brand: PropTypes.string
};

const CreditCardInfoWithApollo = compose(
  graphql(CREDIT_CARD_QUERY, {
    options: { fetchPolicy: 'network-only' },
    props({ data: { loading, stripeSubscriptionCard } }) {
      return {
        loading,
        expiryMonth: stripeSubscriptionCard && stripeSubscriptionCard.expiryMonth,
        expiryYear: stripeSubscriptionCard && stripeSubscriptionCard.expiryYear,
        last4: stripeSubscriptionCard && stripeSubscriptionCard.last4,
        brand: stripeSubscriptionCard && stripeSubscriptionCard.brand
      };
    }
  })
)(CreditCardInfo);

export default CreditCardInfoWithApollo;
