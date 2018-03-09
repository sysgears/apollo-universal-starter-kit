import React from 'react';
import { Input } from 'reactstrap';

interface SelectProps {
  children: any;
}

const Select = ({ children, ...props }: SelectProps) => {
  return (
    <Input {...props} type="select">
      {children}
    </Input>
  );
};

export default Select;
