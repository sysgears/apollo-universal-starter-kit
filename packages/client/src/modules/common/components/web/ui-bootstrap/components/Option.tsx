import React from 'react';

interface OptionProps {
  children: any;
}

const Option = ({ children, ...props }: OptionProps) => {
  return <option {...props}>{children}</option>;
};

export default Option;
