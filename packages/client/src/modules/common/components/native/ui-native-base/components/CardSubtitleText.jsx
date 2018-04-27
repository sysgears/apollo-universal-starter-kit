import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

import CardItem from './CardItem';

const CardSubtitleText = ({ children, style, ...props }) => {
  return (
    <CardItem>
      <Text style={[styles.text, style]} {...props}>
        {children}
      </Text>
    </CardItem>
  );
};

CardSubtitleText.propTypes = {
  children: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18
  }
});

export default CardSubtitleText;
