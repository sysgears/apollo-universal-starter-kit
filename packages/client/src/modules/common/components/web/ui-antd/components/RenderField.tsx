import React from 'react';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';

interface Meta {
  touched?: boolean;
  error?: string;
}

interface RenderFieldProps {
  input: any;
  label?: string;
  placeholder?: string;
  type?: string;
  meta: Meta;
}

const FormItem = Form.Item;

const RenderField = ({ input, label, type, meta: { touched, error }, placeholder }: RenderFieldProps) => {
  let validateStatus: any = '';
  if (touched && error) {
    validateStatus = 'error';
  }

  return (
    <FormItem label={label} validateStatus={validateStatus} help={touched && error}>
      <div>
        <Input {...input} placeholder={label || placeholder} type={type} />
      </div>
    </FormItem>
  );
};

export default RenderField;
