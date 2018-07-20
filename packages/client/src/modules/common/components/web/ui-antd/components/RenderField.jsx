import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';

const FormItem = Form.Item;

const RenderField = ({ input, label, type, formItemLayout, meta: { touched, error }, placeholder }) => {
  return (
    <FormItem
      label={label}
      {...formItemLayout}
      validateStatus={touched && error ? 'error' : ''}
      help={touched && error}
    >
      <div>
        <Input {...input} placeholder={label || placeholder} type={type} />
      </div>
    </FormItem>
  );
};

RenderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  formItemLayout: PropTypes.object
};

export default RenderField;
