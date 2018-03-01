import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Field from '../../../../utils/FieldAdapter';
import {
  Form,
  RenderField,
  RenderSelect,
  RenderCheckBox,
  Option,
  Button,
  Alert
} from '../../../common/components/web/index';
import { email, minLength, required, match, validateForm } from '../../../../../../common/validation';

import settings from '../../../../../../../settings';

const userFormSchema = {
  username: [required, minLength(3)],
  email: [required, email],
  password: [required, minLength(5)],
  passwordConfirmation: [match('password'), required, minLength(5)]
};

const validate = values => validateForm(values, userFormSchema);

const UserForm = ({ values, handleSubmit, error, setFieldValue }) => {
  const { username, email, role, isActive, profile, auth, password, passwordConfirmation } = values;
  return (
    <Form name="user" onSubmit={handleSubmit}>
      <Field name="username" component={RenderField} type="text" label="Username" value={username} />
      <Field name="email" component={RenderField} type="email" label="Email" value={email} />
      <Field name="role" component={RenderSelect} type="select" label="Role" value={role}>
        <Option value="user">user</Option>
        <Option value="admin">admin</Option>
      </Field>
      <Field name="isActive" component={RenderCheckBox} type="checkbox" label="Is Active" checked={isActive} />
      <Field
        name="firstName"
        component={RenderField}
        type="text"
        label="First Name"
        value={profile.firstName}
        onChange={value => setFieldValue('profile', { ...profile, firstName: value })}
      />
      <Field
        name="lastName"
        component={RenderField}
        type="text"
        label="Last Name"
        value={profile.lastName}
        onChange={value => setFieldValue('profile', { ...profile, lastName: value })}
      />
      {settings.user.auth.certificate.enabled && (
        <Field
          name="serial"
          component={RenderField}
          type="text"
          label="Serial"
          value={auth && auth.certificate && auth.certificate.serial}
          onChange={value => setFieldValue('auth', { ...auth, certificate: { ...auth.certificate, serial: value } })}
        />
      )}
      <Field name="password" component={RenderField} type="password" label="Password" value={password} />
      <Field
        name="passwordConfirmation"
        component={RenderField}
        type="password"
        label="Password Confirmation"
        value={passwordConfirmation}
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
  initialValues: PropTypes.object.isRequired,
  touched: PropTypes.object
};

const UserFormWithFormik = withFormik({
  mapPropsToValues: values => {
    const { username, email, role, isActive, profile } = values.initialValues;
    return {
      username: username,
      email: email,
      role: role || 'user',
      isActive: isActive,
      password: '',
      passwordConfirmation: '',
      profile: {
        firstName: profile && profile.firstName,
        lastName: profile && profile.lastName
      },
      auth: {
        ...values.initialValues.auth
      }
    };
  },
  async handleSubmit(values, { setErrors, resetForm, props: { onSubmit } }) {
    await onSubmit(values)
      .then(() => resetForm({ username: '', email: '', password: '', passwordConfirmation: '' }))
      .catch(e => setErrors(e));
  },
  displayName: 'SignUpForm ', // helps with React DevTools
  validate: values => validate(values)
});

export default UserFormWithFormik(UserForm);
