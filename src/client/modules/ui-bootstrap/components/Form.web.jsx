import React from 'react';
import PropTypes from 'prop-types';
import { Form as RSForm } from 'reactstrap';

const Form = ({ children, ...props }) => {
  return <RSForm {...props}>{children}</RSForm>;
};

Form.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string
};

export default Form;
