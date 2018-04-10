import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

const CardItem = ({ children, style }) => {
  return <View style={style}>{children}</View>;
};

CardItem.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
};

export default CardItem;
