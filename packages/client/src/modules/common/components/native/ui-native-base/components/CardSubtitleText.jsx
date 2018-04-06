import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

import CardItem from './CardItem';

const CardSubtitleText = ({ children, ...props }) => {
  return (
    <CardItem>
      <Text style={styles.text} {...props}>
        {children}
      </Text>
    </CardItem>
  );
};

CardSubtitleText.propTypes = {
  children: PropTypes.string
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18
  }
});

export default CardSubtitleText;
