import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet } from 'react-native';

const Modal = ({ text }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{text}</Text>
  </View>
);

Modal.propTypes = {
  text: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center'
  }
});

export default Modal;
