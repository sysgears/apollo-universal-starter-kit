import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';

const FormItem = Form.Item;

const RenderField = ({ input, label, type, meta: { touched, error } }) => {
  let validateStatus = '';
  if (touched && error) {
    validateStatus = 'error';
  }

  return (
    <FormItem label={label} validateStatus={validateStatus} help={touched && error}>
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
