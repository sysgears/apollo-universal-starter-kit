import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

const LayoutCenter = ({ children }) => {
  const { container, layout, offset, content, column } = styles;

  return (
    <View style={container}>
      <View style={layout}>
        <View style={offset} />
        <View style={content}>
          <View style={column}>{children}</View>
        </View>
        <View style={offset} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  content: {
    flexGrow: 3
  },
  offset: {
    flexGrow: 3
  }
});

LayoutCenter.propTypes = {
  children: PropTypes.node
};

export default LayoutCenter;
