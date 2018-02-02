import React from 'react';
import PropTypes from 'prop-types';
import { Field, Form, Formik } from 'formik';
//import Field from '../../../utils/FieldAdapter';
import { RenderField, RenderSelect, RenderCheckBox, Option, Button, Alert } from '../../common/components/web';
import { email, minLength } from '../../../../../common/validation';

import settings from '../../../../../../settings';

const validate = values => {
  const errors = {};
  console.log('validate values', values);
  const fields = ['username', 'email', 'password', 'passwordConfirmation'];
  fields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    } else if (values.email && email(values.email)) {
      errors.email = email(values.email);
    } else if (values.password && minLength(5)(values.password)) {
      errors.password = minLength(5)(values.password);
    } else if (values.passwordConfirmation && minLength(5)(values.passwordConfirmation)) {
      errors.passwordConfirmation = minLength(5)(values.passwordConfirmation);
    } else if (values.username && minLength(3)(values.username)) {
      errors.username = minLength(3)(values.username);
    }
  });
  if (values.profile && !values.profile.firstName) {
    errors.firstName = 'Required';
  }
  if (values.profile && !values.profile.lastName) {
    errors.lastName = 'Required';
  }
  if (!values.profile) {
    errors.lastName = 'Required';
    errors.firstName = 'Required';
  }
  if (values.password !== values.passwordConfirmation) {
    errors.passwordConfirmation = 'Passwords do not match';
  }
  console.log('errors', errors);
  return errors;
};

export const UserForm = ({ initialValues, onSubmit }) => (
  <div>
    <h1>My Cool Form</h1>
    <Formik
      onSubmit={values => {
        return onSubmit(values);
      }}
      validate={values => validate(values)}
      initialValues={{
        ...initialValues,
        isActive: (initialValues && initialValues.isActive) || false,
        role: (initialValues && initialValues.role) || 'user'
      }}
    >
      {props => {
        const { values, handleChange, touched, errors, setFieldValue, setTouched } = props;
        const handleSetTouch = name => {
          setTouched({ ...touched, [name]: true });
        };
        return (
          <Form
            name="user"
            onSubmit={e => {
              e.preventDefault();
              setTouched({
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                password: true,
                passwordConfirmation: true
              });
            }}
          >
            <Field
              name="username"
              component={RenderField}
              type="text"
              label="Username"
              input={{
                value: values.username || '',
                name: 'username',
                onChange: handleChange,
                onBlur: () => handleSetTouch('username')
              }}
              meta={{ touched: touched.username, error: errors.username || '' }}
            />
            <Field
              name="email"
              component={RenderField}
              type="email"
              label="Email"
              input={{
                value: values.email || '',
                name: 'email',
                onChange: handleChange,
                onBlur: () => handleSetTouch('email')
              }}
              meta={{ touched: touched.email, error: errors.email || '' }}
            />
            <Field
              name="role"
              component={RenderSelect}
              type="select"
              label="Role"
              input={{
                value: values.role || 'user',
                name: 'role',
                onChange: handleChange
              }}
              meta={{ touched: touched.role, error: errors.role || '' }}
            >
              <Option value="user">user</Option>
              <Option value="admin">admin</Option>
            </Field>
            <Field
              name="isActive"
              component={RenderCheckBox}
              type="checkbox"
              label="Is Active"
              input={{
                defaultChecked: values.isActive,
                name: 'isActive'
              }}
              meta={{ touched: touched.isActive, error: errors.isActive || '' }}
            />
            <Field
              name="firstName"
              component={RenderField}
              type="text"
              label="First Name"
              input={{
                value: (values.profile && values.profile.firstName) || '',
                name: 'firstName',
                onChange: e => setFieldValue('profile', { ...values.profile, firstName: e.target.value }),
                onBlur: () => handleSetTouch('firstName')
              }}
              meta={{ touched: touched.firstName, error: errors.firstName || '' }}
            />
            <Field
              name="lastName"
              component={RenderField}
              type="text"
              label="Last Name"
              onChange={handleChange}
              input={{
                value: (values.profile && values.profile.lastName) || '',
                name: 'lastName',
                onChange: e => setFieldValue('profile', { ...values.profile, lastName: e.target.value }),
                onBlur: () => handleSetTouch('lastName')
              }}
              meta={{ touched: touched.lastName, error: errors.lastName || '' }}
            />
            {settings.user.auth.certificate.enabled && (
              <Field
                name="auth.certificate.serial"
                component={RenderField}
                type="text"
                label="Serial"
                input={{
                  value: (values.auth && values.auth.certificate.serial) || '',
                  name: 'serial',
                  onChange: e =>
                    setFieldValue('auth', {
                      ...values.auth,
                      certificate: { ...values.auth.certificate, serial: e.target.value }
                    })
                }}
                meta={{ touched: false, error: '' }}
              />
            )}
            <Field
              name="password"
              component={RenderField}
              type="password"
              label="Password"
              input={{
                value: values.password || '',
                name: 'password',
                onChange: handleChange,
                onBlur: () => handleSetTouch('password')
              }}
              meta={{ touched: touched.password, error: errors.password || '' }}
            />
            <Field
              name="passwordConfirmation"
              component={RenderField}
              type="password"
              label="Password Confirmation"
              input={{
                value: values.passwordConfirmation || '',
                name: 'passwordConfirmation',
                onChange: handleChange,
                onBlur: () => handleSetTouch('passwordConfirmation')
              }}
              meta={{ touched: touched.passwordConfirmation, error: errors.passwordConfirmation || '' }}
            />
            <Button color="primary" type="submit">
              Save
            </Button>
          </Form>
        );
      }}
    </Formik>
  </div>
);

UserForm.propTypes = {
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  setFieldValue: PropTypes.func,
  onSubmit: PropTypes.func,
  setTouched: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  values: PropTypes.object,
  errors: PropTypes.object,
  initialValues: PropTypes.object,
  touched: PropTypes.object
};

export default UserForm;
