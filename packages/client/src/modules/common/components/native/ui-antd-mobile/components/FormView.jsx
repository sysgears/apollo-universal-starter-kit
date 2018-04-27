import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';

const FormView = ({ children, style, ...props }) => {
  return (
    <ScrollView style={[styles.scroll, style]} keyboardShouldPersistTaps="always" keyboardDismissMode="none" {...props}>
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
    marginBottom: 5
  }
});

export default FormView;
