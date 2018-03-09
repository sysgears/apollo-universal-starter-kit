import React from 'react';
import { Label as RSLabel } from 'reactstrap';

interface LabelProps {
  children: any;
}

const Label = ({ children, ...props }: LabelProps) => {
  return <RSLabel {...props}>{children}</RSLabel>;
};

export default Label;
