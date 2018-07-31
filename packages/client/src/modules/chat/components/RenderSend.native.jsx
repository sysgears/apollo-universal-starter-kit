import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Send } from 'react-native-gifted-chat';
import PropTypes from 'prop-types';

const RenderSend = props => {
  const { sendButtonName } = props;
  return (
    <Send {...props}>
      <View style={styles.container}>
        <Text style={styles.button}>{sendButtonName}</Text>
      </View>
    </Send>
  );
};

RenderSend.propTypes = {
  sendButtonName: PropTypes.String
};

const styles = StyleSheet.create({
  container: {
    height: 46,
    paddingRight: 5,
    paddingLeft: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },

  button: {
    fontWeight: 'bold',
    fontSize: 18
  }
});

export default RenderSend;
