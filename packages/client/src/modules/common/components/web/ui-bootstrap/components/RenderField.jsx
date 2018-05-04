import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';

const RenderField = ({ input, options, meta: { touched, error } }) => {
  const { label, placeholder } = input;
  const invalid = !!(touched && error);

  return (
    <FormGroup {...options}>
      {label && <Label for={input.name}>{label}</Label>}
      <Input id={input.name} {...input} placeholder={placeholder || label || ''} invalid={invalid} />
      {invalid && <FormFeedback>{error}</FormFeedback>}
    </FormGroup>
  );
};

RenderField.propTypes = {
  input: PropTypes.object,
  options: PropTypes.object,
  meta: PropTypes.object
};

export default RenderField;
