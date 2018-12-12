import React from 'react';
import PropTypes from 'prop-types';
import { NavItem } from 'reactstrap';

const MenuItem = ({ children, ...props }) => {
  return <NavItem {...props}>{children}</NavItem>;
};

MenuItem.propTypes = {
  children: PropTypes.node
};

export default MenuItem;
