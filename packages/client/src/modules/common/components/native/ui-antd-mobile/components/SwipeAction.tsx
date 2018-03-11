import React from 'react';
import ADSwipeAction from 'antd-mobile/lib/swipe-action';
import List from 'antd-mobile/lib/list';

interface SwipeActionProps {
  children: any;
  right: any;
  onPress: () => void;  
}

const SwipeAction = ({ children, onPress, right, ...props }: SwipeActionProps) => {
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

export default SwipeAction;
