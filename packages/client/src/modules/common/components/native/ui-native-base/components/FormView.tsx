import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

interface FormViewProps {
  children: any;
}

const FormView = ({ children }: FormViewProps) => {
  return (
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 10,
    backgroundColor: '#fff'
  }
});

export default FormView;
