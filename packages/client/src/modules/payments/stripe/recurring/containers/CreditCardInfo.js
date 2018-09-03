import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import CreditCardInfoView from '../components/CreditCardInfoView';
import translate from '../../../../../i18n';

import CREDIT_CARD_QUERY from '../graphql/CreditCardQuery.graphql';

const CreditCardInfo = ({ t }) => (
  <Query query={CREDIT_CARD_QUERY} fetchPolicy="network-only">
    {({ loading, data }) => <CreditCardInfoView loading={loading} t={t} creditCard={data.stripeSubscriptionCard} />}
  </Query>
);

CreditCardInfo.propTypes = {
  t: PropTypes.func
};

export default translate('subscription')(CreditCardInfo);
