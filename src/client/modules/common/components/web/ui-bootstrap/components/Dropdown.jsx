import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown as RSDropdown } from 'reactstrap';

const Dropdown = ({ children, ...props }) => {
  return <RSDropdown {...props}>{children}</RSDropdown>;
};

Dropdown.propTypes = {
  children: PropTypes.node
};

export default Dropdown;
