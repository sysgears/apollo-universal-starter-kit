import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';

const RenderField = ({ input, name, label, type, meta: { touched, error }, children, placeholder }) => {
  let valid = true;
  if (touched && error) {
    valid = false;
  }

  const labelId = name + '-label';

  return (
    <FormGroup>
      {label && <Label id={labelId}>{label}</Label>}
      <div>
        <Input aria-labelledby={labelId} {...input} placeholder={label || placeholder} type={type} invalid={!valid}>
          {children}
        </Input>
        {touched && (error && <FormFeedback>{error}</FormFeedback>)}
      </div>
    </FormGroup>
  );
};

RenderField.propTypes = {
  input: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  placeholder: PropTypes.string,
  children: PropTypes.array
};

export default RenderField;
