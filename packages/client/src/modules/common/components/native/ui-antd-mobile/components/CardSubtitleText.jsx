import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

const CardSubtitleText = ({ children, ...props }) => {
  return (
    <Text style={styles.text} {...props}>
      {children}
    </Text>
  );
};

CardSubtitleText.propTypes = {
  children: PropTypes.string
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18
  }
});

export default CardSubtitleText;
