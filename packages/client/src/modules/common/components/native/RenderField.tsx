import React from 'react';
import { InputItem } from './';

interface Meta {
  touched: boolean;
  error: string;
}

interface RenderFieldProps {
  input: any;
  label: string;
  type: string;
  meta: Meta;
}

const RenderField = ({ input, label, meta: { touched, error }, ...inputProps }: RenderFieldProps) => {
  let hasError = false;
  if (touched && error) {
    hasError = true;
  }

  return (
    <InputItem
      value={input.value}
      placeholder={label}
      onChange={input.onChange}
      onChangeText={input.onChangeText}
      onBlur={input.onBlur}
      onFocus={input.onFocus}
      {...inputProps}
      error={hasError}
    >
      {label}
    </InputItem>
  );
};

export default RenderField;
