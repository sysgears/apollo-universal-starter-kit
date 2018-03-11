import React from 'react';
import ADInputItem from 'antd-mobile/lib/input-item';

interface InputItemProps {
  children: any;  
}

const InputItem = ({ children, ...props }: InputItemProps) => {
  return <ADInputItem {...props}>{children}</ADInputItem>;
};

export default InputItem;
