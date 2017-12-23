import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';
import List from 'antd-mobile/lib/list';

const FormView = ({ children }) => {
  return (
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      <List>{children}</List>
    </ScrollView>
  );
};

FormView.propTypes = {
  children: PropTypes.node
};

const styles = StyleSheet.create({
  scroll: {
    marginBottom: 5
  }
});

export default FormView;
