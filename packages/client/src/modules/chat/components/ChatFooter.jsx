import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

const ChatFooter = ({ text, username, undoQuote }) => (
  <View style={styles.container}>
    <View style={styles.leftLine} />
    <View>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
    <View style={styles.closeButton}>
      <TouchableOpacity>
        <Icon name="x" type="feather" color="#0084ff" onPress={undoQuote} />
      </TouchableOpacity>
    </View>
  </View>
);

ChatFooter.propTypes = {
  username: PropTypes.string,
  text: PropTypes.string,
  undoQuote: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row'
  },

  leftLine: {
    height: 50,
    width: 5,
    backgroundColor: 'red'
  },

  username: {
    color: 'red',
    paddingLeft: 10,
    paddingTop: 5
  },

  text: {
    color: 'gray',
    paddingLeft: 10,
    paddingTop: 5
  },

  closeButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10
  }
});

export default ChatFooter;
