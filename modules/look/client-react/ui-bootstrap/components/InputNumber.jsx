import React from 'react';
import PropTypes from 'prop-types';
import { Input } from './index';

const InputNumber = ({ children, ...props }) => {
  return (
    <Input type="number" {...props}>
      {children}
    </Input>
  );
};

InputNumber.propTypes = {
  children: PropTypes.node
};

export default InputNumber;
