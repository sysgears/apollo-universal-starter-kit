import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

const CardSubtitleText = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
};

CardSubtitleText.propTypes = {
  children: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    paddingHorizontal: 15,
    marginBottom: 5
  }
});

export default CardSubtitleText;
