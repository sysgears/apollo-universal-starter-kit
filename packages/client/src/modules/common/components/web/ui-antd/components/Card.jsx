import React from 'react';
import PropTypes from 'prop-types';
import { Card as ADCard } from 'antd';

const Card = ({ children, ...props }) => {
  return <ADCard {...props}>{children}</ADCard>;
};

Card.propTypes = {
  children: PropTypes.node
};

export default Card;
