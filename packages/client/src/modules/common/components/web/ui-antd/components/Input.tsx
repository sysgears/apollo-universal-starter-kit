import React from 'react';
import ADInput from 'antd/lib/input';

interface InputProps {
  children: any;
}

const Input = ({ children, ...props }: InputProps) => {
  return <ADInput {...props}>{children}</ADInput>;
};

export default Input;
