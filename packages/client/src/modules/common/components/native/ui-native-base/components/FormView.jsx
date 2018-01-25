import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';

const FormView = ({ children }) => {
  return (
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      {children}
    </ScrollView>
  );
};

FormView.propTypes = {
  children: PropTypes.node
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 10,
    backgroundColor: '#fff'
  }
});

export default FormView;
