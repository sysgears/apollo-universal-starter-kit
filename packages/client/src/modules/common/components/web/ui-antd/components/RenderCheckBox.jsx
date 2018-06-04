import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Form } from 'antd';

const FormItem = Form.Item;

const RenderCheckBox = ({ input, label, meta: { touched, error } }) => {
  let validateStatus = '';
  if (touched && error) {
    validateStatus = 'error';
  }

  return (
    <FormItem label={label} validateStatus={validateStatus} help={error}>
      <div>
        <Checkbox {...input}>{label}</Checkbox>
      </div>
    </FormItem>
  );
};

RenderCheckBox.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};

export default RenderCheckBox;
