import React from 'react';
import PropTypes from 'prop-types';
import ADForm from 'antd/lib/form';

interface FormProps {
  children: any;
  type?: string;
}

const Form = ({ children, ...props }) => {
  return <ADForm {...props}>{children}</ADForm>;
};

export default Form;
