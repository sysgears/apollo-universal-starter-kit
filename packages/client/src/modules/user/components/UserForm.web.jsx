import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Yup from 'yup';
import Field from '../../../utils/FieldAdaptor';
import { Form, RenderField, RenderSelect, RenderCheckBox, Option, Button, Alert } from '../../common/components/web';

import settings from '../../../../../../settings';

const validate = values => {
  const errors = {};

  if (values.password !== values.passwordConfirmation) {
    errors.passwordConfirmation = 'Passwords do not match';
  }
  return errors;
};

const UserForm = ({ values, handleSubmit, submitting, error, handleChange }) => {
  return (
    <Form name="user" onSubmit={handleSubmit}>
      <Field
        name="username"
        component={RenderField}
        type="text"
        label="Username"
        value={values.username || ''}
        onChange={handleChange}
      />
      <Field
        name="email"
        component={RenderField}
        type="email"
        label="Email"
        value={values.email || ''}
        onChange={handleChange}
      />
      <Field
        name="role"
        component={RenderSelect}
        type="select"
        label="Role"
        value={values.role}
        onChange={handleChange}
      >
        <Option value="user">user</Option>
        <Option value="admin">admin</Option>
      </Field>
      <Field
        name="isActive"
        component={RenderCheckBox}
        type="checkbox"
        label="Is Active"
        defaultChecked={values.isActive}
      />
      <Field
        name="firstName"
        component={RenderField}
        type="text"
        label="First Name"
        value={values.firstName}
        onChange={handleChange}
      />
      <Field
        name="lastName"
        component={RenderField}
        type="text"
        label="Last Name"
        value={values.lastName}
        onChange={handleChange}
      />
      {settings.user.auth.certificate.enabled && (
        <Field
          name="auth.certificate.serial"
          component={RenderField}
          type="text"
          label="Serial"
          value={values.lastName}
        />
      )}
      <Field
        name="password"
        component={RenderField}
        type="password"
        label="Password"
        value={values.password}
        onChange={handleChange}
      />
      <Field
        name="passwordConfirmation"
        component={RenderField}
        type="password"
        label="Password Confirmation"
        value={values.passwordConfirmation}
        onChange={handleChange}
      />
      {error && <Alert color="error">{error}</Alert>}
      <Button color="primary" type="submit" disabled={submitting}>
        Save
      </Button>
    </Form>
  );
};

UserForm.propTypes = {
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  values: PropTypes.object
};

const UserFormWithFormik = withFormik({
  mapPropsToValues: values => ({
    username: (values.initialValues && values.initialValues.username) || '',
    email: (values.initialValues && values.initialValues.email) || '',
    role: (values.initialValues && values.initialValues.role) || 'admin',
    isActive: (values.initialValues && values.initialValues.isActive) || false,
    firstName: (values.initialValues && values.initialValues.profile.firstName) || '',
    lastName: (values.initialValues && values.initialValues.profile.lastName) || '',
    password: '',
    passwordConfirmation: ''
  }),
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .min(3, `Must be 3 characters or more`)
      .required('Username is required!'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required!'),
    password: Yup.string()
      .min(5, `Must be 5 characters or more`)
      .required('Password is required!'),
    passwordConfirmation: Yup.string()
      .min(5, `Must be 5 characters or more`)
      .required('Password confirmation is required!'),
    'profile.firstName': Yup.string()
      .min(3, `Must be 5 characters or more`)
      .required('First name is required!'),
    'profile.lastName': Yup.string()
      .min(3, `Must be 5 characters or more`)
      .required('First name is required!')
  }),
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    resetForm({ username: '', email: '', password: '', passwordConfirmation: '' });
  },
  displayName: 'SignUpForm ', // helps with React DevTools
  validate
});

export default UserFormWithFormik(UserForm);
