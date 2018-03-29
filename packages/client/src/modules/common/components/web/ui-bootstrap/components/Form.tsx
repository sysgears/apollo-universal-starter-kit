import React from 'react';
import { Form as RSForm } from 'reactstrap';

interface FormProps {
  children: any;
  layout: string;
  type: string;
}

const Form = ({ children, layout, ...props }: FormProps) => {
  let inline = false;
  if (layout === 'inline') {
    inline = true;
  }
  return (
    <RSForm {...props} inline={inline}>
      {children}
    </RSForm>
  );
};

export default Form;
