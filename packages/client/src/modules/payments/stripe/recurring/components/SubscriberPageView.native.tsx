import React from 'react';
import { Text, View } from 'react-native';

import { TranslateFunction } from '../../../../../i18n';

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

  return (
    <View>
      <Text>{t('subscriberPage.title')}</Text>
      <Text>
        {t('subscriberPage.msg')} {subscriberNumber.number}.
      </Text>
    </View>
  );
};
