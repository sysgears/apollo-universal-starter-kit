import React from 'react';
import PropTypes from 'prop-types';
import { Button as ADButton } from 'antd';

const Button = ({ children, color, type, ...props }) => {
  return (
    <ADButton type={color} htmlType={type} {...props}>
      {children}
    </ADButton>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  type: PropTypes.string
};

export default Button;
