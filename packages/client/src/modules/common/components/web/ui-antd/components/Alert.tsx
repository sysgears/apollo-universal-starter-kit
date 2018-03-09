import React from 'react';
import PropTypes from 'prop-types';
import ADAlert from 'antd/lib/alert';

interface AlertProps {
  color: 'success' | 'info' | 'warning' | 'error';
  children: any;
}

const Alert = ({ children, color, ...props }: AlertProps) => {
  return <ADAlert message={children} type={color} {...props} />;
};

export default Alert;
