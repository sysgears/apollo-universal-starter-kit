import React, { Fragment } from 'react';
import { StyleSheet, Text } from 'react-native';
import { TranslateFunction } from '@gqlapp/i18n-client-react';
import { Card, CardSubtitleText } from '@gqlapp/look-client-react-native';

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
    return <Text>{t('loading')}</Text>;
  }

  return (
    <Fragment>
      <Card>
        <CardSubtitleText style={styles.title}>{t('subscriptionProfile.title')}</CardSubtitleText>
        {stripeSubscription && !stripeSubscription.active ? (
          <CardSubtitleText style={styles.container}>{t('subscriptionProfile.noSubscription')}</CardSubtitleText>
        ) : (
          <Fragment>
            <CreditCardInfo />
            <CancelSubscription />
          </Fragment>
        )}
      </Card>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default SubscriptionProfileView;
