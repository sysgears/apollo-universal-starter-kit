import React from 'react';
import PropTypes from 'prop-types';

const Form = ({ children, ...props }) => {
  return <form {...props}>{children}</form>;
};

Form.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string
};

export default Form;
