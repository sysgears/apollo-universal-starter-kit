import React from 'react';
import PropTypes from 'prop-types';
import ADButton from 'antd-mobile/lib/button';

const Button = ({ children, onPress, ...props }) => {
  return (
    <ADButton onClick={onPress} {...props}>
      {children}
    </ADButton>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onPress: PropTypes.func
};

export default Button;
