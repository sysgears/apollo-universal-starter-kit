import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';

const FormItem = Form.Item;

const RenderField = ({ input, label, type, children, meta: { touched, error } }) => {
  let validateStatus = '';
  if (touched && error) {
    validateStatus = 'error';
  }

  return (
    <FormItem label={label} validateStatus={validateStatus} help={error}>
      <div>
        <Select {...input} type={type}>
          {children}
        </Select>
      </div>
    </FormItem>
  );
};

RenderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  children: PropTypes.node
};

export default RenderField;
