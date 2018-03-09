import React from 'react';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';

interface Meta {
  touched: boolean;
  error: string;
}

interface RenderFieldProps {
  input: any;
  label: string;
  type: string;
  meta: Meta;
  placeholder: string;
  children: any;
}

const RenderField = ({ input, label, type, meta: { touched, error }, children, placeholder }) => {
  let valid = null;
  if (touched && error) {
    valid = false;
  }

  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <div>
        <Input {...input} placeholder={label || placeholder} type={type} valid={valid}>
          {children}
        </Input>
        {touched && (error && <FormFeedback>{error}</FormFeedback>)}
      </div>
    </FormGroup>
  );
};

export default RenderField;
