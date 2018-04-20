import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

const CardText = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
};

CardText.propTypes = {
  children: PropTypes.string,
  style: PropTypes.number
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14
  }
});

export default CardText;
