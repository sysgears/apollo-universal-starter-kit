import React from 'react';
import PropTypes from 'prop-types';
import { Button as RSButton } from 'reactstrap';

const Button = ({ children, htmlType, ...props }) => {
  return <RSButton {...props}>{children}</RSButton>;
};

Button.propTypes = {
  children: PropTypes.node,
  htmlType: PropTypes.any
};

export default Button;
