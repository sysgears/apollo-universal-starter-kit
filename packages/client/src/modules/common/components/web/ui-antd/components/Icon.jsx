import React from 'react';
import PropTypes from 'prop-types';
import ADIcon from 'antd/lib/icon';

const Icon = ({ children, ...props }) => {
  return <ADIcon {...props}>{children}</ADIcon>;
};

Icon.propTypes = {
  children: PropTypes.node
};

export default Icon;
