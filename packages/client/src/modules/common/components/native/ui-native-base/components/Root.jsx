import React from 'react';
import PropTypes from 'prop-types';
import { Root as NBRoot } from 'native-base';

const Root = ({ children, ...props }) => {
  return <NBRoot {...props}>{children}</NBRoot>;
};

Root.propTypes = {
  children: PropTypes.node
};

export default Root;
