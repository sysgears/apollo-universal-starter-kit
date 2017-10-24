import React from 'react';
import PropTypes from 'prop-types';
import { Form as ADForm } from 'antd';

const Form = ({ children, ...props }) => {
  return <ADForm {...props}>{children}</ADForm>;
};

Form.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string
};

export default Form;
