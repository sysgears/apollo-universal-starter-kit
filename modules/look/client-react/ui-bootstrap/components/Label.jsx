import React from 'react';
import PropTypes from 'prop-types';
import { Label as RSLabel } from 'reactstrap';

const Label = ({ children, ...props }) => {
  return <RSLabel {...props}>{children}</RSLabel>;
};

Label.propTypes = {
  children: PropTypes.node
};

export default Label;
