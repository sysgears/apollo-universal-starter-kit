import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { StyleSheet, ScrollView } from 'react-native';
import { Button, RenderField } from '../../common/components';

const required = value => value ? undefined : 'Required';

const CommentForm = ({ handleSubmit, valid, initialValues, onSubmit }) => {
  let operation = 'Add';
  if (initialValues.id !== null) {
    operation = 'Edit';
  }

  return (
    <ScrollView style={styles.scrollStyle} keyboardShouldPersistTaps={'handled'}>
      <Field name="content" component={RenderField} type="text" label="Content" validate={required}/>
      <Button onPress={handleSubmit(onSubmit)} disabled={valid}>{operation}</Button>
    </ScrollView>
  );
};

CommentForm.propTypes = {
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  valid: PropTypes.bool
};

const styles = StyleSheet.create({
  scrollStyle: {
    marginBottom: 5,
  },
});

export default reduxForm({
  form: 'comment',
  enableReinitialize: true
})(CommentForm);
