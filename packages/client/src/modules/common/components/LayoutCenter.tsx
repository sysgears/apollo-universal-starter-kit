import React from 'react';
import { View, StyleSheet } from 'react-native';

interface LayoutCenterProps {
  children: any;
}

const LayoutCenter = ({ children }: LayoutCenterProps) => {
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

export default LayoutCenter;
