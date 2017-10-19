import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Form, RenderField, RenderCheckBox, RenderErrors, Button } from '../../common/components';

const required = value => (value ? undefined : 'Required');

export const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;
export const minLength3 = minLength(3);

const validate = values => {
  const errors = {};

  if (values.password !== values.passwordConfirmation) {
    errors.passwordConfirmation = 'Passwords do not match';
  }
  return errors;
};

const UserForm = ({ handleSubmit, submitting, onSubmit, errors }) => {
  return (
    <Form name="post" onSubmit={handleSubmit(onSubmit)}>
      <Field name="username" component={RenderField} type="text" label="Username" validate={[required, minLength3]} />
      <Field name="email" component={RenderField} type="email" label="Email" validate={required} />
      <Field name="isAdmin" component={RenderCheckBox} type="checkbox" label="Is Admin" />
      <Field name="isActive" component={RenderCheckBox} type="checkbox" label="Is Active" />
      <Field name="password" component={RenderField} type="password" label="Password" />
      <Field name="passwordConfirmation" component={RenderField} type="password" label="Password Confirmation" />
      <RenderErrors errors={errors} />
      <Button color="primary" type="submit" disabled={submitting}>
        Save
      </Button>
    </Form>
  );
};

UserForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  errors: PropTypes.array
};

export default reduxForm({
  form: 'user',
  validate
})(UserForm);
