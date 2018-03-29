import React from 'react';
import { Text } from 'react-native';
import { Button as NBButton } from 'native-base';

interface ButtonProps {
  children: any;
}

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <NBButton block {...props}>
      <Text>{children}</Text>
    </NBButton>
  );
};

export default Button;
