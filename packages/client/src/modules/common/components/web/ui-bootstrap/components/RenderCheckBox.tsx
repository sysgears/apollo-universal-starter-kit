import React from 'react';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';

interface Meta {
  touched: boolean;
  error: string;
}

interface RenderCheckBoxProps {
  input: any;
  label?: string;
  type: string;
  meta: Meta;
}

const RenderCheckBox = ({ input, label, type, meta: { touched, error } }: RenderCheckBoxProps) => {
  let color = 'normal';
  if (touched && error) {
    color = 'danger';
  }

  return (
    <FormGroup color={color} check>
      <Label check>
        <Input {...input} placeholder={label} type={type} /> {label}
        {touched && (error && <FormFeedback>{error}</FormFeedback>)}
      </Label>
    </FormGroup>
  );
};

export default RenderCheckBox;
