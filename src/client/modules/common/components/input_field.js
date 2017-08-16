import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TextInput } from 'react-native';

const InputField = ({ onChangeText, onBlur, onFocus, value, ...inputProps }) => {
  const { containerStyle, inputStyle, textStyle } = styles;

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>Label</Text>
      <TextInput style={inputStyle} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} value={value} {...inputProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: '#FFF',
    color: '#000',
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
    lineHeight: 20,
    flex: 2
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1
  },
  containerStyle: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  }
});

InputField.propTypes = {
  onChangeText: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
};

export default InputField;
