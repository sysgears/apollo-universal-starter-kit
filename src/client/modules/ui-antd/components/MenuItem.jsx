import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';

const MenuItem = ({ children, ...props }) => {
  return <Menu.Item {...props}>{children}</Menu.Item>;
};

MenuItem.propTypes = {
  children: PropTypes.node
};

export default MenuItem;
