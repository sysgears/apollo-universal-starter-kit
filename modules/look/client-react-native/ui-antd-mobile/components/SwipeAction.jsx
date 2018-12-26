import React from 'react';
import PropTypes from 'prop-types';
import { SwipeAction as ADSwipeAction, List } from 'antd-mobile-rn';

const SwipeAction = ({ children, onPress, right, ...props }) => {
  return (
    <ADSwipeAction
      style={{ backgroundColor: 'gray' }}
      autoClose
      {...props}
      right={[
        {
          text: right.text,
          onPress: right.onPress,
          style: { backgroundColor: '#F4333C', color: 'white' }
        }
      ]}
    >
      <List.Item arrow="horizontal" onClick={onPress}>
        {children}
      </List.Item>
    </ADSwipeAction>
  );
};

SwipeAction.propTypes = {
  children: PropTypes.node,
  right: PropTypes.object,
  onPress: PropTypes.func
};

export default SwipeAction;
