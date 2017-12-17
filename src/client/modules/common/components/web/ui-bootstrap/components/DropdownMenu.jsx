import React from 'react';
import PropTypes from 'prop-types';
import { DropdownMenu as RSDropdownMenu } from 'reactstrap';

const DropdownMenu = ({ children, ...props }) => {
  return <RSDropdownMenu {...props}>{children}</RSDropdownMenu>;
};

DropdownMenu.propTypes = {
  children: PropTypes.node
};

export default DropdownMenu;
