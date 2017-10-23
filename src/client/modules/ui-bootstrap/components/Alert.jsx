import React from 'react';
import PropTypes from 'prop-types';
import { Alert as RSAlert } from 'reactstrap';

const Alert = ({ children, ...props }) => {
  return <RSAlert {...props}>{children}</RSAlert>;
};

Alert.propTypes = {
  children: PropTypes.node
};

export default Alert;
