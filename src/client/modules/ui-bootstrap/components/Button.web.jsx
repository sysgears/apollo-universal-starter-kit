import React from 'react';
import PropTypes from 'prop-types';
import { Button as RSButton } from 'reactstrap';

const Button = ({ children, ...props }) => {
  return <RSButton {...props}>{children}</RSButton>;
};

Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string
};

export default Button;
