import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import { Button as NBButton } from 'native-base';

const Button = ({ children, ...props }) => {
  return (
    <NBButton block {...props}>
      <Text style={styles.textStyle}>{children}</Text>
    </NBButton>
  );
};

Button.propTypes = {
  children: PropTypes.string
};

const styles = StyleSheet.create({
  textStyle: {
    alignSelf: 'center',
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  }
});

export default Button;
