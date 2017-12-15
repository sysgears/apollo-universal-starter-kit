import React from 'react';
import PropTypes from 'prop-types';
import Menu from 'antd/lib/menu';

class MenuItem extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    const { children, ...props } = this.props;
    return <Menu.Item {...props}>{children}</Menu.Item>;
  }
}

export default MenuItem;
