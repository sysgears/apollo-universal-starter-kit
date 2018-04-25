import React from 'react';
import PropTypes from 'prop-types';

const Root = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
};

Root.propTypes = {
  children: PropTypes.node
};

export default Root;
