import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/lib/form';
import Switch from 'antd/lib/switch';

const FormItem = Form.Item;

const RenderField = ({ input: { value, ...restInput }, label, meta: { touched, error } }) => {
  let validateStatus = '';
  if (touched && error) {
    validateStatus = 'error';
  }

  return (
    <FormItem label={label} validateStatus={validateStatus} help={touched && error}>
      <div>
        <Switch defaultChecked={!!value} {...restInput} />
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
