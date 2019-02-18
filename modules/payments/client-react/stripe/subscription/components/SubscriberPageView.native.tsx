import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TranslateFunction } from '@gqlapp/i18n-client-react';
import { Card, CardSubtitleText } from '@gqlapp/look-client-react-native';

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
        <CardSubtitleText style={{}}>{`${t('subscriberPage.msg')} ${subscriberNumber.number}.`}</CardSubtitleText>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  subscriberPageWrapper: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 20
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20
  }
});
