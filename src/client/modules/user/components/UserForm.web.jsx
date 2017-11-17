import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Form, RenderField, RenderSelect, RenderCheckBox, Option, Button, Alert } from '../../common/components/web';

import settings from '../../../../../settings';

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

const UserForm = ({ handleSubmit, submitting, onSubmit, error }) => {
  return (
    <Form name="post" onSubmit={handleSubmit(onSubmit)}>
      <Field name="username" component={RenderField} type="text" label="Username" validate={[required, minLength3]} />
      <Field name="email" component={RenderField} type="email" label="Email" validate={required} />
      <Field name="role" component={RenderSelect} type="select" label="Role">
        <Option value="user">user</Option>
        <Option value="admin">admin</Option>
      </Field>
      <Field name="isActive" component={RenderCheckBox} type="checkbox" label="Is Active" />
      <Field name="profile.firstName" component={RenderField} type="text" label="First Name" validate={required} />
      <Field name="profile.lastName" component={RenderField} type="text" label="Last Name" validate={required} />
      {settings.user.auth.certificate.enabled && (
        <Field name="auth.certificate.serial" component={RenderField} type="text" label="Serial" validate={required} />
      )}
      <Field name="password" component={RenderField} type="password" label="Password" />
      <Field name="passwordConfirmation" component={RenderField} type="password" label="Password Confirmation" />
      {error && <Alert color="error">{error}</Alert>}
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
  error: PropTypes.string
};

export default reduxForm({
  form: 'user',
  validate
})(UserForm);
