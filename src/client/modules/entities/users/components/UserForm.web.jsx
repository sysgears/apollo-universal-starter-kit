/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Form, RenderField, RenderSelect, RenderCheckBox, Option, Button, Alert } from '../../../common/components/web';
import { required, email, minLength } from '../../../../../common/validation';

import settings from '../../../../../../settings';

const authn = settings.auth.authentication;
const authz = settings.auth.authorization;

const validate = values => {
  const errors = {};

  if (values.password !== values.passwordConfirmation) {
    errors.passwordConfirmation = 'Passwords do not match';
  }
  return errors;
};

const UserForm = ({ handleSubmit, submitting, onSubmit, error }) => {
  return (
    <Form name="user" onSubmit={handleSubmit(onSubmit)}>
      <Field
        name="profile.displayName"
        component={RenderField}
        type="text"
        label="Display Name"
        validate={[required, minLength(3)]}
      />

      <Field name="email" component={RenderField} type="email" label="Email" validate={[required, email]} />

      <Field name="role" component={RenderSelect} type="select" label="Role">
        {authz.userRoles.map(role => <Option value="{role}">{role}</Option>)}
      </Field>

      <Field name="isActive" component={RenderCheckBox} type="checkbox" label="Is Active" />

      <Field name="profile.firstName" component={RenderField} type="text" label="First Name" validate={required} />
      <Field name="profile.lastName" component={RenderField} type="text" label="Last Name" validate={required} />

      {authn.apikey.enabled && (
        <Field name="auth.apikey.name" component={RenderField} type="text" label="Apikey" validate={required} />
      )}

      {authn.certificate.enabled && (
        <Field name="auth.certificate.serial" component={RenderField} type="text" label="Serial" validate={required} />
      )}

      {authn.password.enabled && (
        <div>
          <Field
            name="password"
            component={RenderField}
            type="password"
            label="Password"
            validate={[required, minLength(5)]}
          />
          <Field
            name="passwordConfirmation"
            component={RenderField}
            type="password"
            label="Password Confirmation"
            validate={[required, minLength(5)]}
          />
        </div>
      )}

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
