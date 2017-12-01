import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Item, Label, Input, Icon } from 'native-base';

const InputItem = ({ children, error, ...props }) => {
  return (
    <Item fixedLabel style={styles.item} error={error}>
      <Label>{children}</Label>
      <Input {...props} />
      {error && <Icon name="close-circle" />}
    </Item>
  );
};

InputItem.propTypes = {
  children: PropTypes.node,
  error: PropTypes.bool
};

const styles = StyleSheet.create({
  item: {
    paddingLeft: 10
  }
});

export default InputItem;
