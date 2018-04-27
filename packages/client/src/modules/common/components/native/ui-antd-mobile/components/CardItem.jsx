import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

const CardItem = ({ children, style }) => {
  return <View style={[styles.item, style]}>{children}</View>;
};

CardItem.propTypes = {
  children: PropTypes.node,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15
  }
});

export default CardItem;
