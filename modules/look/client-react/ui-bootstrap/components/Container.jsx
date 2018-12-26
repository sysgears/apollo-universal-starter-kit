import React from 'react';
import PropTypes from 'prop-types';
import { Container as RSContainer } from 'reactstrap';

const Container = ({ children, ...props }) => {
  return <RSContainer {...props}>{children}</RSContainer>;
};

Container.propTypes = {
  children: PropTypes.node
};

export default Container;
