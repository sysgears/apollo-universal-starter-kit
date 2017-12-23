import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';
import { Button } from 'native-base';

const FormButton = ({ children, ...props }) => {
  return (
    <Button block {...props} style={styles.button}>
      <Text style={styles.textStyle}>{children}</Text>
    </Button>
  );
};

FormButton.propTypes = {
  children: PropTypes.node
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15
  },
  textStyle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500'
  }
});

export default FormButton;
