import React from 'react';
import PropTypes from 'prop-types';
import { Card as CardComponent } from 'native-base';

const Card = ({ children, ...props }) => {
  return <CardComponent {...props}>{children}</CardComponent>;
};

Card.propTypes = {
  children: PropTypes.node
};

export default Card;
