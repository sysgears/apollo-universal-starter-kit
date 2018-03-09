import React from 'react';
import { Alert as RSAlert } from 'reactstrap';

interface AlertProps {
  children: any;
  color: string;
}

const Alert = ({ children, color, ...props }: AlertProps) => {
  if (color === 'error') {
    color = 'danger';
  }
  return (
    <RSAlert {...props} color={color}>
      {children}
    </RSAlert>
  );
};

export default Alert;
