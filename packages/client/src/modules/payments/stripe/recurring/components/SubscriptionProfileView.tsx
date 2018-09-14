import React, { Fragment } from 'react';

import CreditCardInfo from '../containers/CreditCardInfo';
import CancelSubscription from '../containers/CancelSubscription';
import { CardGroup, CardText, CardTitle } from '../../../../common/components/web';

// TODO: ADD types
export default ({ t, loading, stripeSubscription }: any) => {
  if (loading) {
    return <span>Loading</span>;
  }

  // TODO: refactor this
  // if (stripeSubscription && !stripeSubscription.active) {
  //   return (
  //
  //   );
  // }

  return (
    <div style={{ border: '2px dashed black', margin: '20px' }}>
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
