import React from 'react';
import PropTypes from 'prop-types';
import ADForm from 'antd/lib/form';

const Form = ({ children, input, name, handleSubmit }) => {
  return (
    <ADForm name={name} {...input} onSubmit={handleSubmit}>
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
