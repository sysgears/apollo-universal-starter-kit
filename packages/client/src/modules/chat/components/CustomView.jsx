import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

const CustomView = props => {
  const {
    images,
    currentMessage: {
      loadingImage,
      reply,
      replyMessage,
      user: { _id: id }
    },
    user: { _id: userId }
  } = props;

  if (images && loadingImage) {
    return (
      <View style={styles.uploading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (reply) {
    if (replyMessage) {
      const { text, userName } = replyMessage;
      const color = userId === id ? styles.ownColorText : styles.colorText;
      return (
        <View style={styles.container}>
          <Text style={[styles.username, color]}>{userName}</Text>
          <Text style={color}>{text}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.status}>{'Deleted message'}</Text>
        </View>
      );
    }
  }
  return <View />;
};

CustomView.propTypes = {
  messages: PropTypes.array,
  currentMessage: PropTypes.object,
  user: PropTypes.object,
  images: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#00468A'
  },

  uploading: {
    flex: 1,
    justifyContent: 'center',
    width: 150,
    height: 100,
    margin: 3
  },

  status: {
    color: '#333',
    fontStyle: 'italic'
  },

  username: {
    paddingTop: 5,
    fontWeight: '700'
  },

  image: {
    width: 120,
    height: 50
  },

  colorText: {
    color: '#000'
  },

  ownColorText: {
    color: '#fff'
  }
});

export default CustomView;
