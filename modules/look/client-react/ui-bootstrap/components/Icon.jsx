import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({ children, type, ...props }) => {
  return <i {...props}>{children}</i>;
};

Icon.propTypes = {
  children: PropTypes.node,
  type: PropTypes.any
};

export default Icon;
