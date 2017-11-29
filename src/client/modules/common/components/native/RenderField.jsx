import React from 'react';
import PropTypes from 'prop-types';
import { InputItem } from './';

const RenderField = ({ input, label, meta: { touched, error }, ...inputProps }) => {
  let hasError = false;
  if (touched && error) {
    hasError = true;
  }

  return (
    <InputItem
      value={input.value}
      placeholder={label}
      onChange={input.onChange}
      onBlur={input.onBlur}
      onFocus={input.onFocus}
      {...inputProps}
      error={hasError}
    >
      {label}
    </InputItem>
  );
};

RenderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};

export default RenderField;
