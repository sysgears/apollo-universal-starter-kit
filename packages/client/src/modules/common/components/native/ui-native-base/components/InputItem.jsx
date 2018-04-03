import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { Item, Input } from 'native-base';

const InputItem = ({ children, error, ...props }) => {
  return (
    <View>
      <Item fixedLabel style={styles.item} error={!!error}>
        <Input {...props} />
      </Item>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

InputItem.propTypes = {
  children: PropTypes.node,
  error: PropTypes.string
};

const styles = StyleSheet.create({
  item: {
    paddingLeft: 10
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 3
  }
});

export default InputItem;
