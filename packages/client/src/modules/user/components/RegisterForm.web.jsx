import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Yup from 'yup';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button, Alert } from '../../common/components/web';

const validate = values => {
  const errors = {};

  if (values.password && values.passwordConfirmation && values.password !== values.passwordConfirmation) {
    errors.passwordConfirmation = 'Passwords do not match';
  }
  return errors;
};

const nameMinLength = 5;
const passwordMinLength = 5;
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(nameMinLength, `Must be ${nameMinLength} characters or more`)
    .required('Username is required!'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required!'),
  password: Yup.string()
    .min(passwordMinLength, `Must be ${passwordMinLength} characters or more`)
    .required('Password is required!'),
  passwordConfirmation: Yup.string()
    .min(passwordMinLength, `Must be ${passwordMinLength} characters or more`)
    .required('Password confirmation is required!')
});

const RegisterForm = ({ values, handleSubmit, submitting, error }) => {
  return (
    <Form name="register" onSubmit={handleSubmit}>
      <Field name="username" component={RenderField} type="text" label="Username" value={values.username} />
      <Field name="email" component={RenderField} type="text" label="Email" value={values.email} />
      <Field name="password" component={RenderField} type="password" label="Password" value={values.password} />
      <Field
        name="passwordConfirmation"
        component={RenderField}
        type="password"
        label="Password Confirmation"
        value={values.passwordConfirmation}
      />
      <div className="text-center">
        {error && <Alert color="error">{error}</Alert>}
        <Button color="primary" type="submit" disabled={submitting}>
          Register
        </Button>
      </div>
    </Form>
  );
};

RegisterForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  values: PropTypes.object
};

const RegisterFormWithFormik = withFormik({
  validationSchema: validationSchema,
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    resetForm({ username: '', email: '', password: '', passwordConfirmation: '' });
  },
  displayName: 'SignUpForm', // helps with React DevTools
  validate
});

export default RegisterFormWithFormik(RegisterForm);
