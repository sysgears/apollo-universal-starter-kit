import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Switch from './Switch';

const RenderSwitch = ({ label, ...props }) => {
  return (
    <View style={styles.item} label={label}>
      <Text style={styles.text}>{label}</Text>
      <Switch {...props} />
    </View>
  );
};

RenderSwitch.propTypes = {
  label: PropTypes.string
};

const styles = StyleSheet.create({
  item: {
    height: 40,
    marginLeft: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ddd'
  },
  text: {
    fontSize: 17
  }
});

export default RenderSwitch;
