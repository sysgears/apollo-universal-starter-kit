import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TranslateFunction } from '../../../../../i18n';
import { Card, CardSubtitleText } from '../../../../common/components/native';

interface SubscribersOnlyViewProps {
  loading: boolean;
  subscriberNumber: {
    number: number;
  };
  t: TranslateFunction;
}

export default ({ loading, subscriberNumber, t }: SubscribersOnlyViewProps) => {
  if (loading) {
    return <Text>{t('loading')}</Text>;
  }

  return (
    <View style={styles.subscriberPageWrapper}>
      <Card>
        <CardSubtitleText style={styles.title}>{t('subscriberPage.title')}</CardSubtitleText>
        <CardSubtitleText style={styles.container}>
          {`${t('subscriberPage.msg')} ${subscriberNumber.number}.`}
        </CardSubtitleText>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  subscriberPageWrapper: {
    paddingTop: 10,
    paddingHorizontal: 20
  },
  container: {
    flex: 1
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20
  }
});
