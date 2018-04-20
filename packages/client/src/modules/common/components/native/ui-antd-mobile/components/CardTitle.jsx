import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

const CardTitle = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.title, style]} {...props}>
      {children}
    </Text>
  );
};

CardTitle.propTypes = {
  children: PropTypes.string,
  style: PropTypes.number
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600'
  }
});

export default CardTitle;
