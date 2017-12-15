import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { FormView, RenderField, FormButton } from '../../common/components/native';
import { required, email, minLength } from '../../../../common/validation';

const ContactForm = ({ handleSubmit, valid, onSubmit }) => {
  return (
    <FormView>
      <Field name="name" component={RenderField} type="text" label="Name" validate={[required, minLength(1)]} />
      <Field name="email" component={RenderField} type="text" label="Email" validate={[required, email]} />
      <Field
        name="content"
        component={RenderField}
        type="textarea"
        label="Content"
        validate={[required, minLength(10)]}
      />
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
