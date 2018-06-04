import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Switch from './Switch';
import RenderSwitchStyles from '../styles/RenderSwitch';

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

const styles = StyleSheet.create(RenderSwitchStyles);

export default RenderSwitch;
