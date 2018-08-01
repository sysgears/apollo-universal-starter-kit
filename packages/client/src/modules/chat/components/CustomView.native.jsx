import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

const CustomView = props => {
  const {
    messages,
    currentMessage: { loadingImage, reply }
  } = props;

  if (loadingImage) {
    return (
      <View style={styles.uploading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (reply) {
    const replyMessage = messages.find(({ _id }) => _id === reply);
    if (replyMessage) {
      const {
        text,
        user: { name }
      } = replyMessage;

      return (
        <View style={styles.container}>
          <View style={styles.messageInfo}>
            <Text style={styles.username}>{name}</Text>
            <Text style={styles.text}>{text}</Text>
          </View>
        </View>
      );
    }
  }
  return <View />;
};

CustomView.propTypes = {
  messages: PropTypes.array,
  currentMessage: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    padding: 5
  },

  uploading: {
    flex: 1,
    justifyContent: 'center',
    width: 150,
    height: 100,
    margin: 3
  },

  messageInfo: {
    backgroundColor: '#005CB5',
    borderRadius: 15,
    borderLeftWidth: 15,
    borderLeftColor: '#00468A'
  },

  username: {
    color: 'white',
    paddingHorizontal: 10,
    paddingTop: 5,
    fontWeight: '700'
  },

  text: {
    color: 'white',
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 5
  }
});

export default CustomView;
