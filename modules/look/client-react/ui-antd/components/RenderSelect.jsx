import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import Select from './Select';

const FormItem = Form.Item;

const RenderSelect = props => {
  const {
    input,
    label,
    type,
    children,
    meta: { touched, error }
  } = props;
  let validateStatus = '';
  if (touched && error) {
    validateStatus = 'error';
  }

  const onChange = value => {
    const { formik, name } = props;
    formik.handleChange({ target: { value, name } });
  };

  return (
    <FormItem label={label} validateStatus={validateStatus} help={error}>
      <div>
        <Select {...input} type={type} onChange={onChange}>
          {children}
        </Select>
      </div>
    </FormItem>
  );
};

RenderSelect.propTypes = {
  formik: PropTypes.object.isRequired,
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  name: PropTypes.string.isRequired,
  children: PropTypes.node
};

export default RenderSelect;
