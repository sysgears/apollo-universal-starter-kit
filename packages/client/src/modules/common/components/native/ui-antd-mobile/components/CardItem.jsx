import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

const CardItem = ({ children, style }) => {
  return <View style={{ ...styles.item, ...style }}>{children}</View>;
};

CardItem.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
};

const styles = {
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginVertical: 15
  }
};

export default CardItem;
