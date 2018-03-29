import React from 'react';
import PropTypes from 'prop-types';
import ADInputNumber from 'antd/lib/input-number';

const InputNumber = ({ children, ...props }) => {
  return <ADInputNumber {...props}>{children}</ADInputNumber>;
};

InputNumber.propTypes = {
  children: PropTypes.node
};

export default InputNumber;
