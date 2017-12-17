import React from 'react';
import PropTypes from 'prop-types';
import { DropdownToggle as RSDropdownToggle } from 'reactstrap';

const DropdownToggle = ({ children, ...props }) => {
  return <RSDropdownToggle {...props}>{children}</RSDropdownToggle>;
};

DropdownToggle.propTypes = {
  children: PropTypes.node
};

export default DropdownToggle;
