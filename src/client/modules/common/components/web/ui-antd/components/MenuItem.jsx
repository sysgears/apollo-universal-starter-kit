import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'antd/lib/tooltip';
import { Item } from 'rc-menu';

class MenuItem extends React.Component {
  static contextTypes = {
    inlineCollapsed: PropTypes.bool
  };
  static isMenuItem = 1;

  onKeyDown = e => {
    this.menuItem.onKeyDown(e);
  };
  saveMenuItem = menuItem => {
    this.menuItem = menuItem;
  };
  render() {
    const { inlineCollapsed } = this.context;
    const props = this.props;
    // Work around SSR bug in AntD 3.x. rc-menu item wrapping with rc-tooltip not being SSR-friendly.
    if (__SERVER__) {
      return <Item {...props} ref={this.saveMenuItem} />;
    } else {
      return (
        <Tooltip
          title={inlineCollapsed && props.level === 1 ? props.children : ''}
          placement="right"
          overlayClassName={`${props.rootPrefixCls}-inline-collapsed-tooltip`}
        >
          <Item {...props} ref={this.saveMenuItem} />
        </Tooltip>
      );
    }
  }
}

export default MenuItem;
