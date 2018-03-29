import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import List from 'antd-mobile/lib/list';

interface FormViewProps {
  children: any;
}

const FormView = ({ children }: FormViewProps) => {
  return (
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      <List>{children}</List>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    marginBottom: 5
  }
});

export default FormView;
