import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Text, View } from 'native-base';
import { SwipeRow } from 'react-native-swipe-list-view';

const SwipeAction = ({ children, onPress, right, ...props }) => {
  return (
    <SwipeRow disableRightSwipe={true} rightOpenValue={-100} {...props}>
      <View style={styles.hidden}>
        <Button danger onPress={right.onPress}>
          <Text>{right.text}</Text>
        </Button>
      </View>
      <TouchableOpacity activeOpacity={1} style={styles.text} onPress={onPress}>
        <Text>{children}</Text>
      </TouchableOpacity>
    </SwipeRow>
  );
};

SwipeAction.propTypes = {
  children: PropTypes.node,
  right: PropTypes.object,
  onPress: PropTypes.func
};

const styles = StyleSheet.create({
  hidden: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
    height: 50
  },
  text: {
    backgroundColor: 'white',
    padding: 10,
    height: 50
  }
});

export default SwipeAction;
