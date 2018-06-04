import React from 'react';
import PropTypes from 'prop-types';
import { CardItem as NBCardItem } from 'native-base';

const CardItem = ({ children, ...props }) => {
  return <NBCardItem {...props}>{children}</NBCardItem>;
};

CardItem.propTypes = {
  children: PropTypes.node
};

export default CardItem;
