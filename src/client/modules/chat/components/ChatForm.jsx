import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { FormView, RenderField, FormButton } from '../../common/components/native';

const required = value => (value ? undefined : 'Required');

const ChatForm = ({ handleSubmit, valid, onSubmit }) => {
  return (
    <FormView>
      <Field name="title" component={RenderField} type="text" label="Title" validate={required} />
      <Field name="content" component={RenderField} type="text" label="Content" validate={required} />
      <FormButton onPress={handleSubmit(onSubmit)} disabled={!valid}>
        Save
      </FormButton>
    </FormView>
  );
};

ChatForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  valid: PropTypes.bool
};

export default reduxForm({
  form: 'chat',
  enableReinitialize: true
})(ChatForm);
