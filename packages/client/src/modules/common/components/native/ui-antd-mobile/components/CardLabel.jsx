import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

const CardLabel = ({ children, ...props }) => {
  return (
    <Text style={styles.text} {...props}>
      {children.toUpperCase()}
    </Text>
  );
};

CardLabel.propTypes = {
  children: PropTypes.string
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#686b70'
  }
});

export default CardLabel;
