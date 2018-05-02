import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
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
  itemTitle: {
    flex: 5,
    fontSize: 16
  },
  itemAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default RenderSwitch;
