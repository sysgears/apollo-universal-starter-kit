import React from 'react';
import { Switch as ADSwitch } from 'antd-mobile-rn';
import PropTypes from 'prop-types';

const Switch = ({ checked, value, onChange, ...props }) => {
  return <ADSwitch checked={value || checked} {...props} />;
};

Switch.propTypes = {
  checked: PropTypes.bool,
  value: PropTypes.bool,
  onChange: PropTypes.func
};

export default Switch;
