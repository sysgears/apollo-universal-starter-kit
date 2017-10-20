import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle as RSCardTitle } from 'reactstrap';

const CardTitle = ({ children, ...props }) => {
  return <RSCardTitle {...props}>{children}</RSCardTitle>;
};

CardTitle.propTypes = {
  children: PropTypes.node
};

export default CardTitle;
