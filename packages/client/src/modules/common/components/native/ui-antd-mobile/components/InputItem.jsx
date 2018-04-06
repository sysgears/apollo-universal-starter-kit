import React from 'react';
import PropTypes from 'prop-types';
import ADInputItem from 'antd-mobile/lib/input-item';
import { Text, View, StyleSheet } from 'react-native';

const InputItem = ({ children, error, ...props }) => {
  return (
    <View>
      <ADInputItem {...props}>{children}</ADInputItem>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

InputItem.propTypes = {
  children: PropTypes.node,
  error: PropTypes.string
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 3
  }
});

export default InputItem;
