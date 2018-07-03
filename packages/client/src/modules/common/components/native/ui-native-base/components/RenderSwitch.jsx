import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, View } from 'react-native';
import Switch from './Switch';
import RenderSwitchStyles from '../styles/RenderSwitch';

const RenderSwitch = ({ style, label, ...props }) => {
  return (
    <View style={[styles.itemContainer, style.itemContainer]}>
      <Text style={[styles.itemTitle, style.itemTitle]}>{label}</Text>
      <View style={[styles.itemAction, style.itemAction]}>
        <Switch {...props} />
      </View>
    </View>
  );
};

RenderSwitch.propTypes = {
  label: PropTypes.string,
  style: PropTypes.object
};

const styles = StyleSheet.create(RenderSwitchStyles);

export default RenderSwitch;
