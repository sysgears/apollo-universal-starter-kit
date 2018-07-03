import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, View } from 'react-native';
import Switch from './Switch';
import RenderSwitchStyles from '../styles/RenderSwitch';

const RenderSwitch = ({ style, label, ...props }) => {
  return (
    <View style={[style.itemContainer, styles.itemContainer]}>
      <Text style={[style.itemTitle, styles.itemTitle]}>{label}</Text>
      <View style={[style.itemAction, styles.itemAction]}>
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
