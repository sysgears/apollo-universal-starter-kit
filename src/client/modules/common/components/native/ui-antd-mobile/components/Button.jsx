import React from 'react';
import PropTypes from 'prop-types';
import { Button as ADButton } from 'antd-mobile/lib/button';

const Button = ({ children, ...props }) => {
  return <ADButton {...props}>{children}</ADButton>;
};

Button.propTypes = {
  children: PropTypes.node
};

export default Button;
