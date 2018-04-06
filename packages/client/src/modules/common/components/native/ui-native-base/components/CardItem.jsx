import React from 'react';
import PropTypes from 'prop-types';
import { CardItem as CardItemComponent } from 'native-base';

const CardItem = ({ children, ...props }) => {
  return <CardItemComponent {...props}>{children}</CardItemComponent>;
};

CardItem.propTypes = {
  children: PropTypes.node
};

export default CardItem;
