import React from 'react';
// import ADSelect from 'antd/lib/select';

interface SelectProps {
  children: any;
}

const Select = ({ children, ...props }: SelectProps) => {
  return <select {...props}>{children}</select>;
};

export default Select;
