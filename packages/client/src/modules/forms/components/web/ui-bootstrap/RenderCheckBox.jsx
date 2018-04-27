import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';

const RenderCheckBox = ({ input, options, meta: { touched, error } }) => {
  const invalid = !!(touched && error);

  return (
    <FormGroup check {...options}>
      <Input id={input.name} {...input} invalid={invalid} />
      <Label for={input.name} check>
        {input.label}
      </Label>
      {invalid && <FormFeedback>{error}</FormFeedback>}
    </FormGroup>
  );
};

RenderCheckBox.propTypes = {
  input: PropTypes.object,
  options: PropTypes.object,
  meta: PropTypes.object
};

export default RenderCheckBox;
