import React from 'react';
import PropTypes from 'prop-types';
import ADAlert from 'antd/lib/alert';

const Alert = ({ children, color, ...props }) => {
  return <ADAlert message={children} type={color} {...props} />;
};

Alert.propTypes = {
  children: PropTypes.node,
  color: PropTypes.String
};

export default Alert;
