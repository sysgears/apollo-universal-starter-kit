import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import { Button as NBButton } from 'native-base';

const Button = ({ children, ...props }) => {
  const { buttonStyle, textStyle } = styles;

  return (
    <NBButton style={buttonStyle} {...props}>
      <Text style={textStyle}>{children}</Text>
    </NBButton>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    alignSelf: 'center',
    backgroundColor: '#0275d8',
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  textStyle: {
    alignSelf: 'center',
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  }
});

Button.propTypes = {
  children: PropTypes.node
};

export default Button;
