import React from 'react';
import PropTypes from 'prop-types';
import ADSwipeAction from 'antd-mobile/lib/swipe-action';

const SwipeAction = ({ children, ...props }) => {
  return <ADSwipeAction {...props}>{children}</ADSwipeAction>;
};

SwipeAction.propTypes = {
  children: PropTypes.node
};

export default SwipeAction;
