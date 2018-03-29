import React from 'react';
import ADButton from 'antd/lib/button';

type ButtonColor = 'primary' | 'ghost' | 'dashed' | 'danger';
type ButtonSize = 'small' | 'default' | 'large';

interface ButtonProps {
  children: any;
  color?: ButtonColor;
  type?: string;
  size?: string;
}

const Button = ({ children, color, type, size, ...props }: ButtonProps) => {
  let buttonSize: ButtonSize = 'default';

  if (size === 'sm') {
    buttonSize = 'small';
  } else if (size === 'lg') {
    buttonSize = 'large';
  }

  return (
    <ADButton type={color} htmlType={type} size={buttonSize} {...props}>
      {children}
    </ADButton>
  );
};

export default Button;
