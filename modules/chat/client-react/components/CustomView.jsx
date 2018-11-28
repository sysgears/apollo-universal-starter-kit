import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import PropTypes from 'prop-types';

const CustomView = ({
  allowImages,
  currentMessage: {
    loadingImage,
    quotedId,
    quotedMessage,
    user: { _id: currentId }
  },
  user: { _id: userId }
}) => {
  if (allowImages && loadingImage) {
    return (
      <View style={styles.uploading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (quotedId) {
    const { text, username, image, id } = quotedMessage;
    if (id) {
      const color = userId === currentId ? styles.ownColorText : styles.colorText;
      const imageBlock = image ? <Image style={styles.image} source={{ uri: image }} /> : null;
      return (
        <View style={styles.container}>
          <Text style={[styles.username, color]}>{username ? username : 'Anonymous'}</Text>
          {imageBlock}
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
  allowImages: PropTypes.bool
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
