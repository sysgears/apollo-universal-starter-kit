import React from 'react';
import ADAlert from 'antd/lib/alert';

type AlertType = 'success' | 'info' | 'warning' | 'error';

interface AlertProps {
  color?: AlertType;
  children: any;
}

const Alert = ({ children, color, ...props }: AlertProps) => {
  return <ADAlert message={children} type={color} {...props} />;
};

export default Alert;
