import React from 'react';
import { Input as RSInput } from 'reactstrap';

interface InputProps {
  children: any;
}

const Input = ({ children, ...props }: InputProps) => {
  return <RSInput {...props}>{children}</RSInput>;
};

export default Input;
