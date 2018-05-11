import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';

const ADSubMenu = Menu.SubMenu;

class SubMenu extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    const { children, ...props } = this.props;
    return <ADSubMenu {...props}>{children}</ADSubMenu>;
  }
}

export default SubMenu;
