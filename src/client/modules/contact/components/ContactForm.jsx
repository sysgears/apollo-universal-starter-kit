import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { FormView, RenderField, FormButton } from '../../common/components/native';

const required = value => (value ? undefined : 'Required');

const ContactForm = ({ handleSubmit, valid, onSubmit }) => {
  return (
    <FormView>
      <Field name="name" component={RenderField} type="text" label="Name" validate={required} />
      <Field name="email" component={RenderField} type="text" label="Email" validate={required} />
      <Field name="content" component={RenderField} type="textarea" label="Content" validate={required} />
      <FormButton onPress={handleSubmit(onSubmit)} disabled={!valid}>
        Send
      </FormButton>
    </FormView>
  );
};

ContactForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  valid: PropTypes.bool
};

export default reduxForm({
  form: 'contact',
  enableReinitialize: true
})(ContactForm);
