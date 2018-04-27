import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';

const FormView = ({ children, style }) => {
  return (
    <ScrollView style={[styles.scroll, style]} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      {children}
    </ScrollView>
  );
};

FormView.propTypes = {
  children: PropTypes.node,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 10,
    backgroundColor: '#fff'
  }
});

export default FormView;
