import React from 'react';
import PropTypes from 'prop-types';
import { FormItem, Input } from './index';

const RenderField = ({ input, label, type, formItemLayout, meta: { touched, error } }) => {
  let validateStatus = '';
  if (touched && error) {
    validateStatus = 'error';
  }

  console.log(input);
  return (
    <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={touched && error}>
      <div>
        <Input {...input} placeholder={label} type={type} />
      </div>
    </FormItem>
  );
};

RenderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  formItemLayout: PropTypes.object,
  meta: PropTypes.object
};

export default RenderField;
