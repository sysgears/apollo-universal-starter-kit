import React from 'react';
import { Button as RSButton } from 'reactstrap';

interface ButtonProps {
  children: any;
}

const Button = ({ children, ...props }: ButtonProps) => {
  return <RSButton {...props}>{children}</RSButton>;
};

export default Button;
