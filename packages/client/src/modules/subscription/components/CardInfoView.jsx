import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import translate from '../../../i18n';
import { CardItem, CardText, CardSubtitleText, CardLabel, Button, primary } from '../../common/components/native';

const renderCardItem = (title, value) => (
  <CardItem>
    <CardLabel>{title}</CardLabel>
    <CardText>{value}</CardText>
  </CardItem>
);

const CardInfoView = ({ loading, expiryMonth, expiryYear, last4, brand, t }) => {
  return (
    <View style={styles.container}>
      {!loading &&
        expiryMonth &&
        expiryYear &&
        last4 &&
        brand && (
          <View>
            <CardSubtitleText>{t('card.title')}</CardSubtitleText>
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

CardInfoView.propTypes = {
  loading: PropTypes.bool.isRequired,
  expiryMonth: PropTypes.number,
  expiryYear: PropTypes.number,
  last4: PropTypes.string,
  brand: PropTypes.string,
  t: PropTypes.func
};

export default translate('subscription')(CardInfoView);
