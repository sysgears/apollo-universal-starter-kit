import React from 'react';
import PropTypes from 'prop-types';
import { Card as RSCard } from 'reactstrap';

const Card = ({ children, ...props }) => {
  return <RSCard {...props}>{children}</RSCard>;
};

Card.propTypes = {
  children: PropTypes.node
};

export default Card;
