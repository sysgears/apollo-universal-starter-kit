import React from 'react';
import PropTypes from 'prop-types';
import { FormItem, Input } from './index';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

const RenderField = ({ input, label, type, meta: { touched, error } }) => {
  let validateStatus = '';
  if (touched && error) {
    validateStatus = 'error';
  }

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
  meta: PropTypes.object
};

export default RenderField;
