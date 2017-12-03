import React from 'react';
import PropTypes from 'prop-types';
import ADInput from 'antd/lib/input';

const Input = ({ children, ...props }) => {
  return <ADInput {...props}>{children}</ADInput>;
};

Input.propTypes = {
  children: PropTypes.node
};

export default Input;
