import React from 'react';
import PropTypes from 'prop-types';
import { Input as RSInput } from 'reactstrap';

const Input = ({ children, onPressEnter, ...props }) => {
  return <RSInput {...props}>{children}</RSInput>;
};

Input.propTypes = {
  children: PropTypes.node,
  onPressEnter: PropTypes.func
};

export default Input;
