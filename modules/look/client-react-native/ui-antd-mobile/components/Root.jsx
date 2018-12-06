import React from 'react';
import PropTypes from 'prop-types';

// Added only for compatibility. Need for ui-native-base
const Root = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
};

Root.propTypes = {
  children: PropTypes.node
};

export default Root;
