import React from 'react';
import { Query } from 'react-apollo';

import CreditCardInfoView from '../components/CreditCardInfoView';
import translate, { TranslateFunction } from '../../../../../i18n';

import CREDIT_CARD_QUERY from '../graphql/CreditCardQuery.graphql';

const CreditCardInfo = ({ t }: { t: TranslateFunction }) => (
  <Query query={CREDIT_CARD_QUERY} fetchPolicy="network-only">
    {({ loading, data }) => <CreditCardInfoView loading={loading} t={t} creditCard={data.stripeSubscriptionCard} />}
  </Query>
);

export default translate('stripeSubscription')(CreditCardInfo);
