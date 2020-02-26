import React from 'react';
import PropTypes from 'prop-types';
import { Progress as ADProgress } from 'antd';

const Progress = ({ children, ...props }) => {
  return <ADProgress {...props}>{children}</ADProgress>;
};

Progress.propTypes = {
  children: PropTypes.node
};

export default Progress;
