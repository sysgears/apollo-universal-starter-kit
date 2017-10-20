import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';

const RenderField = ({ input, label, type, meta: { touched, error } }) => {
  let color = 'normal';
  if (touched && error) {
    color = 'danger';
  }

  return (
    <FormGroup color={color}>
      {label && <Label>{label}</Label>}
      <div>
        <Input {...input} placeholder={label} type={type} />
        {touched && (error && <FormFeedback>{error}</FormFeedback>)}
      </div>
    </FormGroup>
  );
};

RenderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};

export default RenderField;
