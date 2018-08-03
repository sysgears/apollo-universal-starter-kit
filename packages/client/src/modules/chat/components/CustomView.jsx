import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import PropTypes from 'prop-types';

const CustomView = props => {
  const {
    messages,
    images,
    currentMessage: {
      loadingImage,
      reply,
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
    const replyMessage = messages.find(({ _id }) => _id === reply);
    if (replyMessage) {
      const {
        text,
        image,
        user: { name }
      } = replyMessage;
      const color = userId === id ? styles.ownColorText : styles.colorText;
      return (
        <View style={styles.container}>
          <Text style={[styles.username, color]}>{name}</Text>
          <Image style={styles.image} source={{ uri: image ? image : null }} />
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
