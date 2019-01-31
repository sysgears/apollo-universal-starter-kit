import React from 'react';
import PropTypes from 'prop-types';
import { Icon as ADIcon } from 'antd';

const Icon = ({ children, ...props }) => {
  return <ADIcon {...props}>{children}</ADIcon>;
};

Icon.propTypes = {
  children: PropTypes.node
};

export default Icon;
