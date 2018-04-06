import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

const CardTitle = ({ children, ...props }) => {
  return (
    <Text style={styles.title} {...props}>
      {children}
    </Text>
  );
};

CardTitle.propTypes = {
  children: PropTypes.string
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600'
  }
});

export default CardTitle;
