import React from 'react';
import ADForm from 'antd/lib/form';

interface FormProps {
  children: any;
  type?: string;
}

const Form = ({ children, ...props }: FormProps) => {
  return <ADForm {...props}>{children}</ADForm>;
};

export default Form;
