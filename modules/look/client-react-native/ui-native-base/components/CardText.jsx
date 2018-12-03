import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import CardTextStyles from '../styles/CardText';

const CardText = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
};

CardText.propTypes = {
  children: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
};

const styles = StyleSheet.create(CardTextStyles);

export default CardText;
