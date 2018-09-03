import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TranslateFunction } from '../../../../../i18n';
import { CardItem, CardText, CardSubtitleText, CardLabel, Button, primary } from '../../../../common/components/native';

interface CardInfoViewProps {
  loading: boolean;
  expiryMonth: number;
  expiryYear: number;
  last4: string;
  brand: string;
  t: TranslateFunction;
}

const renderCardItem = (title: string, value: string) => (
  <CardItem>
    <CardLabel style>{title}</CardLabel>
    <CardText style>{value}</CardText>
  </CardItem>
);

export default ({ loading, expiryMonth, expiryYear, last4, brand, t }: CardInfoViewProps) => {
  return (
    <View style={styles.container}>
      {!loading &&
        expiryMonth &&
        expiryYear &&
        last4 &&
        brand && (
          <View>
            <CardSubtitleText style>{t('card.title')}</CardSubtitleText>
            {renderCardItem(`${t('card.text.card')}: `, `${brand} ************${last4}`)}
            {renderCardItem(`${t('card.text.expires')}: `, `${expiryMonth}/${expiryYear}`)}
            <View>
              <View style={styles.buttonWrapper}>
                <Button color={primary}>{t('card.btnUpdate')}</Button>
              </View>
            </View>
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonWrapper: {
    paddingHorizontal: 10
  }
});
