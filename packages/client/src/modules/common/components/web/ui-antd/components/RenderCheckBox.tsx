import React from 'react';
import Form from 'antd/lib/form';
import Checkbox from 'antd/lib/checkbox';

interface Meta {
  touched?: boolean;
  error?: string;
}

interface RenderCheckBoxProps {
  meta: Meta;
  label?: string;
  type?: string;
  input: any;
}

const FormItem = Form.Item;

const RenderCheckBox = ({ input, label, meta: { touched, error } }: RenderCheckBoxProps) => {
  let validateStatus: any = '';
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

export default RenderCheckBox;
