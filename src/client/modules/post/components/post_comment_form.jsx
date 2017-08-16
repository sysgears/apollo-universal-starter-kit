import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { ScrollView, View, Text } from 'react-native';
import { Button, InputField } from '../../common/components';

const required = value => value ? undefined : 'Required';

const renderField = ({ input, meta: { touched, error }, ...inputProps }) => {
  /*let color = 'normal';
  if (touched && error) {
    color = 'danger';
  }*/

  return (
    <View>
      <InputField onChangeText={input.onChange} onBlur={input.onBlur} onFocus={input.onFocus} value={input.value} {...inputProps} />
      {touched && ((error && <Text>{error}</Text>))}
    </View>
  );
};

renderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};

const CommentForm = ({ handleSubmit, valid, initialValues, onSubmit }) => {
  /*let operation = 'Add';
  if (initialValues.id !== null) {
    operation = 'Edit';
  }*/

  return (
    <ScrollView keyboardShouldPersistTaps={'handled'}>
      <Field name="content" component={renderField} type="text" label="Content" validate={required}/>
      <Button onPress={handleSubmit(onSubmit)} disabled={valid}>Save</Button>
    </ScrollView>
  );
};

CommentForm.propTypes = {
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool
};

export default reduxForm({
  form: 'comment',
  enableReinitialize: true
})(CommentForm);
