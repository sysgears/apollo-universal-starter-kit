import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { CardItem, CardText, CardSubtitleText, CardLabel, Button } from '../../common/components/native';

const renderCardItem = (title, value) => (
  <CardItem>
    <CardLabel>{title}</CardLabel>
    <CardText>{value}</CardText>
  </CardItem>
);

const CardInfoView = ({ loading, expiryMonth, expiryYear, last4, brand }) => {
  return (
    <View style={styles.container}>
      {!loading &&
        expiryMonth &&
        expiryYear &&
        last4 &&
        brand && (
          <View>
            <CardSubtitleText>Card Info</CardSubtitleText>
            {renderCardItem('Card: ', `${brand} ************${last4}`)}
            {renderCardItem('Expires: ', `${expiryMonth}/${expiryYear}`)}
            <View>
              <View style={styles.buttonWrapper}>
                <Button color="primary">Update Card</Button>
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
  brand: PropTypes.string
};

export default CardInfoView;
