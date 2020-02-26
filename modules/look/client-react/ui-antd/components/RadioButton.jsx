import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';

const ADRadioButton = Radio.Button;

class RadioButton extends React.Component {
  render() {
    const { children, color, type, size, ...props } = this.props;

    let buttonSize = 'default';

    if (size === 'sm') {
      buttonSize = 'small';
    } else if (size === 'lg') {
      buttonSize = 'large';
    }

    return (
      <ADRadioButton type={color} htmlType={type} size={buttonSize} {...props}>
        {children}
      </ADRadioButton>
    );
  }
}

RadioButton.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.string
};

export default RadioButton;
