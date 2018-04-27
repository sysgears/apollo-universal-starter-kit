import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';
import List from 'antd-mobile/lib/list';

const FormView = ({ children, style }) => {
  return (
    <ScrollView style={[styles.scroll, style]} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      <List>{children}</List>
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
