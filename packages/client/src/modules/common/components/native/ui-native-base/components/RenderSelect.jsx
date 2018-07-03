import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View, Text } from 'react-native';
import Select from './Select';
import RenderSelectStyles from '../styles/RenderSelect';

const RenderSelect = ({ renderSelectStyles, label, ...props }) => {
  const selectProps = {
    iconName: 'caret-down',
    icon: true,
    iconSize: 20,
    ...props
  };
  const computedStyles = renderSelectStyles ? renderSelectStyles : styles;
  return (
    <View style={computedStyles.container}>
      {Platform.OS === 'ios' ? (
        <View style={computedStyles.itemContainer}>
          {label && <Text style={computedStyles.itemTitle}>{label}</Text>}
          <View style={computedStyles.itemAction}>
            <Select {...selectProps} />
          </View>
        </View>
      ) : (
        <View style={computedStyles.itemContainer}>
          {label && <Text style={computedStyles.itemTitle}>{label}</Text>}
          <View style={computedStyles.itemAction}>
            <Select {...props} />
          </View>
        </View>
      )}
    </View>
  );
};

RenderSelect.propTypes = {
  style: PropTypes.number,
  label: PropTypes.string,
  renderSelectStyles: PropTypes.object
};

const styles = StyleSheet.create(RenderSelectStyles);

export default RenderSelect;
