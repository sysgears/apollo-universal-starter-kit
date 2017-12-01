import React from 'react';
import PropTypes from 'prop-types';
import List from 'antd-mobile/lib/list';
import Button from 'antd-mobile/lib/button';

const FormButton = ({ children, onPress, ...props }) => {
  return (
    <List.Item>
      <Button type="primary" onClick={onPress} {...props}>
        {children}
      </Button>
    </List.Item>
  );
};

FormButton.propTypes = {
  children: PropTypes.node,
  onPress: PropTypes.func
};

export default FormButton;
