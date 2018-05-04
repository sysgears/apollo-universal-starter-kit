import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';

import { Option } from './';

const RenderSelect = ({ input, options, meta: { touched, error } }) => {
  const { label, values } = input;
  const invalid = !!(touched && error);

  return (
    <FormGroup {...options}>
      {label && <Label>{label}</Label>}
      <Input {...input} invalid={invalid}>
        {values.map(option => {
          return option.value ? (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ) : (
            <Option key={option} value={option}>
              {option}
            </Option>
          );
        })}
      </Input>
      {invalid && <FormFeedback>{error}</FormFeedback>}
    </FormGroup>
  );
};

RenderSelect.propTypes = {
  input: PropTypes.object,
  options: PropTypes.object,
  meta: PropTypes.object
};

export default RenderSelect;
