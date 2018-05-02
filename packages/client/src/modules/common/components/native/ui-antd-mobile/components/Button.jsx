import React from 'react';
import PropTypes from 'prop-types';
import ADButton from 'antd-mobile/lib/button';
import * as TYPES from '../../ButtonTypes';

const Button = ({ children, onPress, onClick, type, style, ...props }) => {
  const btnData = buttonTypes[type] || {};
  const btnProps = {
    ...props,
    type: btnData.type || 'default',
    style: [btnData.styles, style]
  };

  return (
    <ADButton onClick={onPress || onClick} {...btnProps}>
      {children}
    </ADButton>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onPress: PropTypes.func,
  type: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  onClick: PropTypes.func
};

const getStyles = color => {
  return {
    backgroundColor: color,
    borderColor: color
  };
};

const buttonTypes = {
  primary: {
    type: TYPES.primary
  },
  success: {
    type: TYPES.primary,
    styles: getStyles('#59b662')
  },
  dark: {
    type: TYPES.primary,
    styles: getStyles('#000')
  },
  info: {
    type: TYPES.primary,
    styles: getStyles('#51b1f3')
  },
  danger: {
    type: TYPES.warning
  },
  warning: {
    type: TYPES.primary,
    styles: getStyles('#f6aa57')
  }
};

export default Button;
