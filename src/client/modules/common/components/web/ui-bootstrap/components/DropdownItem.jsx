import React from 'react';
import PropTypes from 'prop-types';
import { DropdownItem as RSDropdownItem } from 'reactstrap';

const DropdownItem = ({ children, ...props }) => {
  return <RSDropdownItem {...props}>{children}</RSDropdownItem>;
};

DropdownItem.propTypes = {
  children: PropTypes.node
};

export default DropdownItem;
