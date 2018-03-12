import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  children: any;
  onPress?: () => void;
  disabled?: boolean;
}

const Button = ({ children, onPress, disabled }: ButtonProps) => {
  const { buttonStyle, textStyle } = styles;

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle} activeOpacity={disabled ? 0.5 : 1}>
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
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

export default Button;
