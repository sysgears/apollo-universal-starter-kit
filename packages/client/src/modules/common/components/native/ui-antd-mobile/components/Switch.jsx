import React from 'react';
import { Switch as ADSwitch } from 'antd-mobile-rn';
import PropTypes from 'prop-types';

const Switch = ({ checked, value, onValueChange, onChange, ...props }) => {
  return <ADSwitch checked={value || checked} onChange={onValueChange || onChange} {...props} />;
};

Switch.propTypes = {
  checked: PropTypes.bool,
  value: PropTypes.bool,
  onValueChange: PropTypes.func,
  onChange: PropTypes.func
};

export default Switch;
