import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import CardItemStyles from '../styles/CardItem';

const CardItem = ({ children, style }) => {
  return <View style={[styles.item, style]}>{children}</View>;
};

CardItem.propTypes = {
  children: PropTypes.node,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
};

const styles = StyleSheet.create(CardItemStyles);

export default CardItem;
