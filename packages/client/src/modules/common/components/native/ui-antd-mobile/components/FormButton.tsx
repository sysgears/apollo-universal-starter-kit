import React from 'react';
import List from 'antd-mobile/lib/list';
import Button from 'antd-mobile/lib/button';

interface FormButtonProps {
  children: any;
  onPress: () => void;  
}

const FormButton = ({ children, onPress, ...props }: FormButtonProps) => {
  return (
    <List.Item>
      <Button type="primary" onClick={onPress} {...props}>
        {children}
      </Button>
    </List.Item>
  );
};

export default FormButton;
