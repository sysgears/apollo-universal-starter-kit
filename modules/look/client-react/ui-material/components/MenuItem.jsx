import React from 'react';
import PropTypes from 'prop-types';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

class MenuItem extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    const { children, ...props } = this.props;
    return <BottomNavigationAction label={children} {...props} />;
  }
}

export default MenuItem;
