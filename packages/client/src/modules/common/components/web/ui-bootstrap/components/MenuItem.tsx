import React from 'react';
import { NavItem } from 'reactstrap';

interface MenuItemProps {
  children: any;
}

const MenuItem = ({ children, ...props }: MenuItemProps) => {
  return <NavItem {...props}>{children}</NavItem>;
};

export default MenuItem;
