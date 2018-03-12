import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';

interface Meta {
  touched?: boolean;
  error?: string;
}

interface RenderSelectProps {
  input: any;
  label?: string;
  type?: string;
  meta: Meta;
  children: any;
}

const FormItem = Form.Item;

const RenderSelect = ({ input, label, type, children, meta: { touched, error } }: RenderSelectProps) => {
  let validateStatus: any = '';
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

export default RenderSelect;
