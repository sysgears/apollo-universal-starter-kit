import React from 'react';
import PropTypes from 'prop-types';
import { Form as RSForm } from 'reactstrap';

const Form = ({ children, input, layout, name, handleSubmit, ...props }) => {
  let inline = false;
  if (layout === 'inline') {
    inline = true;
  }

  return (
    <RSForm {...props} name={name} {...input} inline={inline} onSubmit={handleSubmit}>
      {children}
    </RSForm>
  );
};

Form.propTypes = {
  children: PropTypes.node,
  input: PropTypes.object,
  name: PropTypes.string,
  layout: PropTypes.string,
  handleSubmit: PropTypes.func
};

export default Form;
