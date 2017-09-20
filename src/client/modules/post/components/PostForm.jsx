import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { StyleSheet, ScrollView } from 'react-native';
import { Button, RenderField } from '../../common/components';

const required = value => (value ? undefined : 'Required');

const PostForm = ({ handleSubmit, valid, onSubmit }) => {
  return (
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      <Field name="title" component={RenderField} type="text" label="Title" validate={required} />
      <Field name="content" component={RenderField} type="text" label="Content" validate={required} />
      <Button onPress={handleSubmit(onSubmit)} disabled={valid}>
        Save
      </Button>
    </ScrollView>
  );
};

PostForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  valid: PropTypes.bool
};

const styles = StyleSheet.create({
  scroll: {
    marginBottom: 5
  }
});

export default reduxForm({
  form: 'post',
  enableReinitialize: true
})(PostForm);
