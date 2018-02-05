import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, RenderSelect, RenderCheckBox, Option, Button, Alert } from '../../common/components/web';
import { email, minLength, required, match, validateForm } from '../../../../../common/validation';

import settings from '../../../../../../settings';

const userFormSchema = {
  username: [required, minLength(3)],
  email: [required, email],
  password: [required, minLength(5)],
  passwordConfirmation: [match('password'), required, minLength(5)]
};

const validate = values => validateForm(values, userFormSchema);

const UserForm = ({ values, handleSubmit, error, handleChange, setFieldValue }) => {
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
        value={values.profile.firstName}
        onChange={e => setFieldValue('profile', { ...values.profile, firstName: e.target.value })}
      />
      <Field
        name="lastName"
        component={RenderField}
        type="text"
        label="Last Name"
        value={values.profile.lastName}
        onChange={e => setFieldValue('profile', { ...values.profile, lastName: e.target.value })}
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
      <Button color="primary" type="submit">
        Save
      </Button>
    </Form>
  );
};

UserForm.propTypes = {
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  setFieldValue: PropTypes.func,
  onSubmit: PropTypes.func,
  setTouched: PropTypes.func,
  isValid: PropTypes.bool,
  error: PropTypes.string,
  values: PropTypes.object,
  errors: PropTypes.object,
  initialValues: PropTypes.object,
  touched: PropTypes.object
};

const UserFormWithFormik = withFormik({
  mapPropsToValues: values => ({
    username: (values.initialValues && values.initialValues.username) || '',
    email: (values.initialValues && values.initialValues.email) || '',
    role: (values.initialValues && values.initialValues.role) || 'admin',
    isActive: (values.initialValues && values.initialValues.isActive) || false,
    password: '',
    passwordConfirmation: '',
    profile: {
      firstName: (values.initialValues && values.initialValues.profile.firstName) || '',
      lastName: (values.initialValues && values.initialValues.profile.lastName) || ''
    }
  }),
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    resetForm({ username: '', email: '', password: '', passwordConfirmation: '' });
  },
  displayName: 'SignUpForm ', // helps with React DevTools
  validate: values => validate(values)
});

export default UserFormWithFormik(UserForm);
