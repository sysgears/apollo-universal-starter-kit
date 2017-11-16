import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TextInput } from 'react-native';

const RenderField = ({ input, label, meta: { touched, error }, ...inputProps }) => {
  const { inputText, errorField } = styles;

  return (
    <TextInput
      autoCapitalize="none"
      autoCorrect={false}
      selectionColor="#ff5722"
      underlineColorAndroid="#888"
      onChangeText={input.onChange}
      value={input.value}
      placeholder={label}
      style={[inputText, touched && error && errorField]}
      {...inputProps}
    />
  );
};

const styles = StyleSheet.create({
  inputText: {
    backgroundColor: '#FFF',
    color: '#000',
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 5
  },
  errorField: {
    borderColor: 'red',
    borderWidth: StyleSheet.hairlineWidth
  }
});

RenderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};

export default RenderField;
