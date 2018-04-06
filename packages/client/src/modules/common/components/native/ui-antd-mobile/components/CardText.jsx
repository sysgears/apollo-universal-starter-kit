import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

const CardText = ({ children, ...props }) => {
  return (
    <Text style={styles.text} {...props}>
      {children}
    </Text>
  );
};

CardText.propTypes = {
  children: PropTypes.string
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14
  }
});

export default CardText;
