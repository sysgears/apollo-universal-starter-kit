import React, { Fragment } from 'react';

import CreditCardInfo from '../containers/CreditCardInfo';
import CancelSubscription from '../containers/CancelSubscription';
import { CardGroup, CardText, CardTitle } from '@module/look-client-react';
import { TranslateFunction } from '@module/i18n-client-react';

interface SubscriptionProfileViewProps {
  loading: boolean;
  stripeSubscription: {
    active: boolean;
  };
  t: TranslateFunction;
}

export default ({ t, loading, stripeSubscription }: SubscriptionProfileViewProps) => {
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
