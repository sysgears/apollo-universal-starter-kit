import React from 'react';
import { Item } from 'rc-menu';
import Menu from 'antd/lib/menu';

class MenuItem extends React.Component {
  static isMenuItem = 1;

  saveMenuItem = menuItem => {
    this.menuItem = menuItem;
  };
  render() {
    const props = this.props;
    // Work around SSR bug in AntD 3.x. rc-menu item wrapping with rc-tooltip not being SSR-friendly.
    if (__SERVER__) {
      return <Item {...props} ref={this.saveMenuItem} />;
    } else {
      return <Menu.Item {...props} />;
    }
  }
}

export default MenuItem;
