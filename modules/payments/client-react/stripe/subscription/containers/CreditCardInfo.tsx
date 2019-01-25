import React from 'react';
import { Query } from 'react-apollo';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';

import CreditCardInfoView from '../components/CreditCardInfoView';

import CREDIT_CARD_QUERY from '../graphql/CreditCardQuery.graphql';

const CreditCardInfo = ({ t }: { t: TranslateFunction }) => (
  <Query query={CREDIT_CARD_QUERY} fetchPolicy="network-only">
    {({ loading, data }) => <CreditCardInfoView loading={loading} t={t} creditCard={data.stripeSubscriptionCard} />}
  </Query>
);

export default translate('stripeSubscription')(CreditCardInfo);
