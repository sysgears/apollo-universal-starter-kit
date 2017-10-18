import React from 'react';
import PropTypes from 'prop-types';
import { Button as RSButton } from 'reactstrap';

const Button = ({ children, type, ...props }) => {
  return (
    <RSButton color={type} {...props}>
      {children}
    </RSButton>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string
};

export default Button;
