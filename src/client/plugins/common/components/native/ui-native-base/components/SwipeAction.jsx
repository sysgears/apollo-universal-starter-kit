import React from 'react';
import PropTypes from 'prop-types';
import { SwipeRow, Button, Text } from 'native-base';

const SwipeAction = ({ children, onPress, right, ...props }) => {
  return (
    <SwipeRow
      disableRightSwipe={true}
      rightOpenValue={-90}
      {...props}
      body={
        <Text style={{ paddingLeft: 10, flex: 1 }} onPress={onPress}>
          {children}
        </Text>
      }
      right={
        <Button danger onPress={right.onPress}>
          <Text>{right.text}</Text>
        </Button>
      }
    />
  );
};

SwipeAction.propTypes = {
  children: PropTypes.node,
  right: PropTypes.object,
  onPress: PropTypes.func
};

export default SwipeAction;
