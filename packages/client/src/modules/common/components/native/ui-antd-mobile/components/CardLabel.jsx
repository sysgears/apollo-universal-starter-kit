import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

const CardLabel = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children.toUpperCase()}
    </Text>
  );
};

CardLabel.propTypes = {
  children: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#686b70'
  }
});

export default CardLabel;
