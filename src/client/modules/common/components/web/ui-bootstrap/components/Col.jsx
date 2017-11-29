import React from 'react';
import PropTypes from 'prop-types';
import { Col as RSCol } from 'reactstrap';

const Col = ({ children, ...props }) => {
  return <RSCol {...props}>{children}</RSCol>;
};

Col.propTypes = {
  children: PropTypes.node
};

export default Col;
