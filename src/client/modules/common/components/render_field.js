import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TextInput } from 'react-native';

const RenderField = ({ input, label, meta: { touched, error }, ...inputProps }) => {
  const { container, input, text, error } = styles;

  return (
    <View style={container}>
      <Text style={text}>{label}</Text>
      <TextInput
        style={[input, touched && error && error]}
        onChangeText={input.onChange}
        value={input.value}
        {...inputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#FFF',
    color: '#000',
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
    lineHeight: 20,
    flex: 3,
    marginBottom: 5,
  },
  text: {
    alignSelf: 'center',
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1
  },
  error: {
    borderColor: 'red',
    borderWidth: StyleSheet.hairlineWidth,
  },
  container: {
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
