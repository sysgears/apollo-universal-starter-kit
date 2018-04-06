import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd-mobile/lib';

const CardItem = ({ children, ...props }) => {
  return <Card.Body {...props}>{children}</Card.Body>;
};

CardItem.propTypes = {
  children: PropTypes.node
};

export default CardItem;
