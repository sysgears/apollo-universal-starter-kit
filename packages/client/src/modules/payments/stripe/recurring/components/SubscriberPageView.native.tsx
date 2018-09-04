import React from 'react';
import { TranslateFunction } from '../../../../../i18n';

import { Text, View } from 'react-native';

// import { PageLayout } from '../../../../common/components/web';

interface SubscribersOnlyViewProps {
  loading: boolean;
  subscriberNumber: {
    number: number;
  };
  t: TranslateFunction;
}

export default ({ loading, subscriberNumber, t }: SubscribersOnlyViewProps) => {
  if (loading) {
    return <Text>{t('loading')}</Text>; // TODO: remove all loaders from translation
  }

  // TODO: should refactor
  const subscriberNumberView =
    subscriberNumber && subscriberNumber.number ? subscriberNumber.number : 'NO SUBSCRIPTION';

  return (
    <View>
      <Text>{t('subOnly.title')}</Text>
      <Text>
        {t('subOnly.msg')} {subscriberNumberView}.
      </Text>
    </View>
  );
};
