import React from 'react';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';

interface Meta {
  touched: boolean;
  error: string;
}

interface RenderSelectProps {
  input: any;
  label: string;
  type: string;
  meta: Meta;
  children: any;
}

const RenderSelect = ({ input, label, type, children, meta: { touched, error } }: RenderSelectProps) => {
  let color = 'normal';
  if (touched && error) {
    color = 'danger';
  }

  return (
    <FormGroup color={color}>
      {label && <Label>{label}</Label>}
      <div>
        <Input {...input} type={type}>
          {children}
        </Input>
        {touched && (error && <FormFeedback>{error}</FormFeedback>)}
      </div>
    </FormGroup>
  );
};

export default RenderSelect;
