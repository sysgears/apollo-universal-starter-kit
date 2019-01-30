import React from 'react';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';

const CardGroup = ({ children, ...props }) => {
  return <CardContent {...props}>{children}</CardContent>;
};

CardGroup.propTypes = {
  children: PropTypes.node
};

export default CardGroup;
