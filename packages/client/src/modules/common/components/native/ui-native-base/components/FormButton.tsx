import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button } from 'native-base';

interface FormButtonProps {
  children: any;
}

const FormButton = ({ children, ...props }: FormButtonProps) => {
  return (
    <Button block {...props} style={styles.button}>
      <Text style={styles.textStyle}>{children}</Text>
    </Button>
  );
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
