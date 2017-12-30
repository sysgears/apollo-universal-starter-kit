import React from 'react';
import PropTypes from 'prop-types';
import ADForm from 'antd/lib/form';

const Form = ({ children, ...props }) => {
  return <ADForm {...props}>{children}</ADForm>;
};

Form.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string
};

export default Form;
