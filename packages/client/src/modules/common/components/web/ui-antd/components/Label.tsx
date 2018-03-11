import React from 'react';

interface LabelProps {
  children: any;
}

const Label = ({ children, ...props }: LabelProps) => {
  return <span {...props}>{children}</span>;
};

export default Label;
