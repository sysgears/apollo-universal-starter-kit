import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import SubtitleTextStyles from '../styles/CardSubTitleText';

/* eslint-disable no-unused-vars */
const CardSubtitleText = ({ children, style, styles = {}, ...props }) => {
  return (
    <Text style={[defaultStyles.text, style]} {...props}>
      {children}
    </Text>
  );
};

CardSubtitleText.propTypes = {
  children: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  styles: PropTypes.any
};

const defaultStyles = StyleSheet.create(SubtitleTextStyles);

export default CardSubtitleText;
