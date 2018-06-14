import React from 'react';
import PropTypes from 'prop-types';
import { Alert as RSAlert } from 'reactstrap';

const Alert = ({ children, color, message, ...props }) => {
  if (color === 'error') {
    color = 'danger';
  }

  return (
    <RSAlert {...props} color={color}>
      {children ? children : message}
    </RSAlert>
  );
};

Alert.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  message: PropTypes.string
};

export default Alert;
