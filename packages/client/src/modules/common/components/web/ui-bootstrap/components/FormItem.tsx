import React from 'react';
import { FormGroup, Label } from 'reactstrap';

interface FormItemProps {
  children: any;
  label: string;
}

const FormItem = ({ children, label, ...props }: FormItemProps) => {
  return (
    <FormGroup {...props}>
      {label && <Label size="md">{label}:&nbsp;</Label>}
      {children}
    </FormGroup>
  );
};

export default FormItem;
