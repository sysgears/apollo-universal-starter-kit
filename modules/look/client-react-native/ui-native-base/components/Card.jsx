import React from 'react';
import PropTypes from 'prop-types';
import { Card as NBCard } from 'native-base';

const Card = ({ children, ...props }) => {
  return <NBCard {...props}>{children}</NBCard>;
};

Card.propTypes = {
  children: PropTypes.node
};

export default Card;
