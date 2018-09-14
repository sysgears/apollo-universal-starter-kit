import React from 'react';
import { Text } from 'react-native';

import { Card } from '../../../../common/components/native';
import CreditCardInfo from '../containers/CreditCardInfo';
import CancelSubscription from '../containers/CancelSubscription';

// TODO: Write Types
export default ({ t, loading, stripeSubscription }: any) => {
  if (loading) {
    return <Text>Loading</Text>;
  }

  if (stripeSubscription && !stripeSubscription.active) {
    return <Text>NO SUBSC</Text>;
  }

  return (
    <Card>
      <CreditCardInfo />
      <CancelSubscription />
    </Card>
  );
};
