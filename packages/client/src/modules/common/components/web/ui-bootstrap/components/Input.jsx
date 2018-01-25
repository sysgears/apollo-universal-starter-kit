import React from 'react';
import PropTypes from 'prop-types';
import { Input as RSInput } from 'reactstrap';

const Input = ({ children, ...props }) => {
  return <RSInput {...props}>{children}</RSInput>;
};

Input.propTypes = {
  children: PropTypes.node
};

export default Input;
