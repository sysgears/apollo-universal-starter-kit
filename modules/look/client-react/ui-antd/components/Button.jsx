import React from 'react';
import PropTypes from 'prop-types';
import { Button as ADButton } from 'antd';

class Button extends React.Component {
  render() {
    const { children, color, type, size, ...props } = this.props;

    let buttonSize = 'default';

    if (size === 'sm') {
      buttonSize = 'small';
    } else if (size === 'lg') {
      buttonSize = 'large';
    }

    return (
      <ADButton type={color} htmlType={type} size={buttonSize} {...props}>
        {children}
      </ADButton>
    );
  }
}

Button.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.string
};

export default Button;
