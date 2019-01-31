import React from 'react';
import PropTypes from 'prop-types';
import { InputNumber as ADInputNumber } from 'antd';

const InputNumber = ({ children, ...props }) => {
  return <ADInputNumber {...props}>{children}</ADInputNumber>;
};

InputNumber.propTypes = {
  children: PropTypes.node
};

export default InputNumber;
