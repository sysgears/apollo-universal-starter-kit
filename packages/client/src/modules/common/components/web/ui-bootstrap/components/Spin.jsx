import React from 'react';
import PropTypes from 'prop-types';

const Spin = ({ children, size, ...props }) => {
  let spinnerSize = '';
  if (size === 'small') {
    spinnerSize = 'fa-sm';
  }
  return (
    <i className={'fas fa-spinner fa-spin ' + spinnerSize} {...props}>
      {children}
    </i>
  );
};

Spin.propTypes = {
  children: PropTypes.node,
  size: PropTypes.string
};

export default Spin;
