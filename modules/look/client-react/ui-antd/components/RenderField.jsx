import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';

const FormItem = Form.Item;

const RenderField = ({ input, label, type, inputMode, formItemLayout, meta: { touched, error }, placeholder }) => {
  let validateStatus = '';
  if (touched && error) {
    validateStatus = 'error';
  }

  return (
    <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={touched && error}>
      <div>
        <Input {...input} placeholder={label || placeholder} type={type} inputMode={inputMode} />
      </div>
    </FormItem>
  );
};

RenderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  inputMode: PropTypes.string,
  meta: PropTypes.object,
  formItemLayout: PropTypes.object
};

export default RenderField;
