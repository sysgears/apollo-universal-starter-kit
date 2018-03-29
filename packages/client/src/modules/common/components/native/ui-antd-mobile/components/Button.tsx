import React from 'react';
import ADButton from 'antd-mobile/lib/button';

interface ButtonProps {
  children: any;
  onPress?: () => void;
}

const Button = ({ children, onPress, ...props }: ButtonProps) => {
  return (
    <ADButton onClick={onPress} {...props}>
      {children}
    </ADButton>
  );
};

export default Button;
