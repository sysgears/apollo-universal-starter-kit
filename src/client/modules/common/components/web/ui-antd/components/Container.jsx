import React from 'react';
import PropTypes from 'prop-types';

const Container = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

Container.propTypes = {
  children: PropTypes.node
};

export default Container;
