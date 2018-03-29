import React from 'react';
import Menu from 'antd/lib/menu';

interface MenuItemProps {
  children: any;
}

class MenuItem extends React.Component<MenuItemProps, {}> {
  public render() {
    const { children, ...props } = this.props;
    return <Menu.Item {...props}>{children}</Menu.Item>;
  }
}

export default MenuItem;
