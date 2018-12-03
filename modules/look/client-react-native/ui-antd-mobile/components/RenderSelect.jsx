import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Select from './Select';
import RenderSelectStyles from '../styles/RenderSelect';

const RenderSelect = ({ label, ...props }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{label}</Text>
      <View style={styles.itemAction}>
        <Select iconName="caret-down" icon {...props} />
      </View>
    </View>
  );
};

RenderSelect.propTypes = {
  label: PropTypes.string
};

const styles = StyleSheet.create(RenderSelectStyles);

export default RenderSelect;
