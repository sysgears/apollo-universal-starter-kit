import React from 'react';
import PropTypes from 'prop-types';
import { InputItem as ADInputItem } from 'antd-mobile-rn';
import { Text, View, StyleSheet } from 'react-native';
import InputItemStyles from '../styles/InputItem';

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

const styles = StyleSheet.create(InputItemStyles);

export default InputItem;
