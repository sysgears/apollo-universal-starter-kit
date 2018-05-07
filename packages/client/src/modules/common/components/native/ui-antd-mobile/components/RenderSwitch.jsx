import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { itemAction, itemTitle } from '../../styles';
import Switch from './Switch';

const RenderSwitch = ({ label, ...props }) => {
  return (
    <View style={styles.itemContainer}>
      {label && <Text style={styles.itemTitle}>{label}</Text>}
      <View style={styles.itemAction}>
        <Switch {...props} />
      </View>
    </View>
  );
};

RenderSwitch.propTypes = {
  label: PropTypes.string
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingLeft: 15,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemTitle,
  itemAction
});

export default RenderSwitch;
