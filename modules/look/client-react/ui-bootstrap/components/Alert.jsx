import React from 'react';
import PropTypes from 'prop-types';
import { Alert as RSAlert } from 'reactstrap';

const Alert = ({ children, color, ...props }) => {
  if (color === 'error') {
    color = 'danger';
  }
  return (
    <RSAlert {...props} color={color}>
      {children}
    </RSAlert>
  );
};

Alert.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string
};

export default Alert;
