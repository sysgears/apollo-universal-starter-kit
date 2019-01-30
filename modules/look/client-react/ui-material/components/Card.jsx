import React from 'react';
import PropTypes from 'prop-types';
import MUICard from '@material-ui/core/Card';

const Card = ({ children, ...props }) => {
  return <MUICard {...props}>{children}</MUICard>;
};

Card.propTypes = {
  children: PropTypes.node
};

export default Card;
