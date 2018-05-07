import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { Item, Input } from 'native-base';
import InputItemStyles from '../styles/InputItem';

const InputItem = ({ error, ...props }) => {
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
  error: PropTypes.string
};

const styles = StyleSheet.create(InputItemStyles);

export default InputItem;
