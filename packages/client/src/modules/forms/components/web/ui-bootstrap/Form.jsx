import React from 'react';
import PropTypes from 'prop-types';
import { Form as RSForm } from 'reactstrap';

const Form = ({ children, input, name, handleSubmit }) => {
  return (
    <RSForm name={name} {...input} onSubmit={handleSubmit}>
      {children}
    </RSForm>
  );
};

Form.propTypes = {
  children: PropTypes.node,
  input: PropTypes.object,
  name: PropTypes.string,
  handleSubmit: PropTypes.func
};

export default Form;
