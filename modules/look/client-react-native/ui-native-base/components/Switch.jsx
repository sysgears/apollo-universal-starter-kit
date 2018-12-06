import React from 'react';
import { Switch as NBSwitch } from 'native-base';
import PropTypes from 'prop-types';

const Switch = ({ color, checked, value, onValueChange, onChange, ...props }) => {
  return <NBSwitch onTintColor={color} value={value || checked} onValueChange={onValueChange || onChange} {...props} />;
};

Switch.propTypes = {
  checked: PropTypes.bool,
  value: PropTypes.bool,
  color: PropTypes.string,
  onValueChange: PropTypes.func,
  onChange: PropTypes.func
};

export default Switch;
