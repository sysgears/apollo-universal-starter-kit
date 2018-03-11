import React from 'react';
import Form from 'antd/lib/form';

interface FormItemProps {
  children: any;
}

const ADFormItem = Form.Item;

const FormItem = ({ children, ...props }) => {
  return <ADFormItem {...props}>{children}</ADFormItem>;
};

export default FormItem;
