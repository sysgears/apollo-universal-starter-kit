import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/lib/form';

const ADFormItem = Form.Item;

const FormItem = ({ children, ...props }) => {
  return <ADFormItem {...props}>{children}</ADFormItem>;
};

FormItem.propTypes = {
  children: PropTypes.node
};

export default FormItem;
