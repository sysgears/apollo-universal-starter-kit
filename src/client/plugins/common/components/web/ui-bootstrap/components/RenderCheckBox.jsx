import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';

const RenderCheckBox = ({ input, label, type, meta: { touched, error } }) => {
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

RenderCheckBox.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};

export default RenderCheckBox;
