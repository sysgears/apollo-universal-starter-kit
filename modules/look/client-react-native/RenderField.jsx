import React from 'react';
import PropTypes from 'prop-types';
import { InputItem } from '.';

const RenderField = ({ input, label, meta: { touched, error }, ...inputProps }) => {
  return (
    <InputItem
      value={input.value}
      placeholder={label}
      onChange={input.onChange}
      onChangeText={input.onChangeText}
      onBlur={input.onBlur}
      onFocus={input.onFocus}
      {...inputProps}
      error={touched && error ? error : ''}
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
