import React, { Fragment } from 'react';

import { CardGroup, CardText, CardTitle } from '@gqlapp/look-client-react';
import { TranslateFunction } from '@gqlapp/i18n-client-react';
import CreditCardInfo from '../containers/CreditCardInfo';
import CancelSubscription from '../containers/CancelSubscription';

interface SubscriptionProfileViewProps {
  loading: boolean;
  stripeSubscription: {
    active: boolean;
  };
  t: TranslateFunction;
}

const SubscriptionProfileView = ({ t, loading, stripeSubscription }: SubscriptionProfileViewProps) => {
  if (loading) {
    return <p>{t('loading')}</p>;
  }

  return (
    <div style={{ border: '1px solid black' }}>
      <CardGroup>
        <CardTitle>{t('subscriptionProfile.title')}</CardTitle>
      </CardGroup>
      {stripeSubscription && !stripeSubscription.active ? (
        <CardGroup>
          <CardText>{t('subscriptionProfile.noSubscription')}</CardText>
        </CardGroup>
      ) : (
        <Fragment>
          <CreditCardInfo />
          <CancelSubscription />
        </Fragment>
      )}
    </div>
  );
};

export default SubscriptionProfileView;
