import React from 'react';
import PropTypes from 'prop-types';
import ADCard from 'antd-mobile/lib/card';

const Card = ({ children, ...props }) => {
  return <ADCard {...props}>{children}</ADCard>;
};

Card.propTypes = {
  children: PropTypes.node
};

export default Card;
