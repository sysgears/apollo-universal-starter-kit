import React from 'react';
import PropTypes from 'prop-types';
import InputItem from 'antd-mobile/lib/input-item';

const Input = ({ children, ...props }) => {
  return (
    <InputItem type={'text'} {...props}>
      {children}
    </InputItem>
  );
};

Input.propTypes = {
  children: PropTypes.node
};

export default Input;
