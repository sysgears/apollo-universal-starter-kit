import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';

const FormItem = Form.Item;

const RenderField = ({ input, label, type, children, meta: { touched, error } }) => {
  return (
    <FormItem label={label} validateStatus={touched && error ? 'error' : ''} help={error}>
      <div>
        <select {...input} type={type}>
          {children}
        </select>
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
