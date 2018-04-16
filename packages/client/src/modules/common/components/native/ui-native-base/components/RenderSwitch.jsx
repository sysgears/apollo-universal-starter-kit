import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import { Item } from 'native-base';
import Switch from './Switch';

const RenderSwitch = ({ label, ...props }) => {
  return (
    <Item style={styles.item}>
      <Text style={styles.text}>{label}</Text>
      <Switch {...props} />
    </Item>
  );
};

RenderSwitch.propTypes = {
  label: PropTypes.string
};

const styles = StyleSheet.create({
  item: {
    height: 40,
    paddingHorizontal: 15,
    justifyContent: 'space-between'
  },
  text: {
    fontSize: 17
  }
});

export default RenderSwitch;
