import React from 'react';
import PropTypes from 'prop-types';
import { Form as ADForm } from 'antd';

const Form = ({ children, input, name, handleSubmit, ...props }) => {
  return (
    <ADForm {...props} name={name} {...input} onSubmit={handleSubmit}>
      {children}
    </ADForm>
  );
};

Form.propTypes = {
  children: PropTypes.node,
  input: PropTypes.object,
  name: PropTypes.string,
  handleSubmit: PropTypes.func
};

export default Form;
