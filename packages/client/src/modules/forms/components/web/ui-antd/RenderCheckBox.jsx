import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'antd/lib/checkbox';
import Form from 'antd/lib/form';

const FormItem = Form.Item;

const RenderCheckBox = ({ input, options, meta: { touched, error } }) => {
  let validateStatus = '';
  if (touched && error) {
    validateStatus = 'error';
  }

  return (
    <FormItem label={input.label} validateStatus={validateStatus} help={error} {...options}>
      <div>
        <Checkbox {...input}>{input.label}</Checkbox>
      </div>
    </FormItem>
  );
};

RenderCheckBox.propTypes = {
  input: PropTypes.object,
  options: PropTypes.object,
  meta: PropTypes.object
};

export default RenderCheckBox;
