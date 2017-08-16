import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { ScrollView, View, Text } from 'react-native';
import { Button, InputField } from '../../common/components';

const required = value => value ? undefined : 'Required';

const renderField = ({ input, meta: { touched, error }, ...inputProps }) => {
/*
  let color = 'normal';
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

const PostForm = ({ handleSubmit, valid, onSubmit }) => {
  return (
    <ScrollView keyboardShouldPersistTaps={'handled'}>
      <Field name="title" component={renderField} type="text" label="Title" validate={required}/>
      <Field name="content" component={renderField} type="text" label="Content" validate={required}/>
      <Button onPress={handleSubmit(onSubmit)} disabled={valid}>Save</Button>
    </ScrollView>
  );
};

PostForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  valid: PropTypes.bool
};

export default reduxForm({
  form: 'post',
  enableReinitialize: true
})(PostForm);
