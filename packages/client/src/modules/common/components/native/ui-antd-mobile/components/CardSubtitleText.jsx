import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import SubtitleTextStyles from '../styles/CardSubTitleText';

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

const styles = StyleSheet.create(SubtitleTextStyles);

export default CardSubtitleText;
