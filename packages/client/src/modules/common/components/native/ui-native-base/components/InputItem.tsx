import React from 'react';
import { StyleSheet } from 'react-native';
import { Item, Label, Input, Icon } from 'native-base';

interface InputItemProps {
  children: any;
  error: boolean;
}

const InputItem = ({ children, error, ...props }: InputItemProps) => {
  return (
    <Item fixedLabel style={styles.item} error={error}>
      <Label>{children}</Label>
      <Input {...props} />
      {error && <Icon name="close-circle" />}
    </Item>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingLeft: 10
  }
});

export default InputItem;
