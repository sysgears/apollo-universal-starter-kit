import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';

const RenderTextarea = ({ input, label, type, meta: { touched, error }, children }) => {
  let valid = null;
  if (touched && error) {
    valid = false;
  }

  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <div>
        <Input {...input} placeholder={label} type={type} valid={valid}>
          {children}
        </Input>
        {touched && (error && <FormFeedback>{error}</FormFeedback>)}
      </div>
    </FormGroup>
  );
};

RenderTextarea.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  children: PropTypes.array
};

export default RenderTextarea;
