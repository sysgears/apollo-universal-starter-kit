import React from 'react';
import PropTypes from 'prop-types';
import { Button as ADButton } from 'antd';

const Button = ({ children, type, ...props }) => {
  return (
    <ADButton type={type} {...props}>
      {children}
    </ADButton>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string
};

export default Button;
