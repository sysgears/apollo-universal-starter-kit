import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const CustomView = props => {
  const { text, username } = props;
  return (
    <View style={styles.container}>
      <View style={styles.messageInfo}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

CustomView.propTypes = {
  username: PropTypes.string,
  text: PropTypes.string
};

const styles = StyleSheet.create({
  container: {
    padding: 5
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
