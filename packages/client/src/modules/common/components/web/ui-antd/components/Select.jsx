import React from 'react';
import PropTypes from 'prop-types';

const Select = ({ children, ...props }) => {
  return <select {...props}>{children}</select>;
};

Select.propTypes = {
  children: PropTypes.node
};

export default Select;
