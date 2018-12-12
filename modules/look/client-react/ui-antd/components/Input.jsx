import React from 'react';
import PropTypes from 'prop-types';
import { Input as ADInput } from 'antd';

const Input = ({ children, ...props }) => {
  return <ADInput {...props}>{children}</ADInput>;
};

Input.propTypes = {
  children: PropTypes.node
};

export default Input;
