import React from 'react';
import PropTypes from 'prop-types';
import ADButton from 'antd/lib/button';
import Form from 'antd/lib/form';

const FormItem = Form.Item;

const Button = ({ children, ...props }) => {
  return (
    <FormItem>
      <ADButton htmlType={props.type} {...props}>
        {children}
      </ADButton>
    </FormItem>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string
};

export default Button;
