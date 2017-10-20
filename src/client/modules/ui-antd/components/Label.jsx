import React from 'react';
import PropTypes from 'prop-types';

const Label = ({ children, ...props }) => {
  return <span {...props}>{children}</span>;
};

Label.propTypes = {
  children: PropTypes.node
};

export default Label;
