import React from 'react';
//import Select from 'antd/lib/select';

//const ADOption = Select.Option;

interface OptionProps {
  children: any;
}

const Option = ({ children, ...props }: OptionProps) => {
  return <option {...props}>{children}</option>;
};

export default Option;
