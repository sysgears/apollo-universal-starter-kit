import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TextInput } from 'react-native';

const RenderField = ({ input, label, meta: { touched, error }, ...inputProps }) => {
  const { containerStyle, inputStyle, textStyle, errorStyle } = styles;

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{label}</Text>
      <TextInput
        style={[inputStyle, touched && error && errorStyle]}
        onChangeText={input.onChange}
        onBlur={input.onBlur}
        onFocus={input.onFocus}
        value={input.value}
        {...inputProps}
      />
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
    flex: 3,
    marginBottom: 5,
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1
  },
  errorStyle: {
    borderColor: 'red',
    borderWidth: 1,
  },
  containerStyle: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

RenderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
};

export default RenderField;
