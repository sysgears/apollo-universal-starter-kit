import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button, Alert } from '../../common/components/web';
import { match, email, minLength, required, validateForm } from '../../../../../common/validation';

const registerFormSchema = {
  username: [required, minLength(3)],
  email: [required, email],
  password: [required, minLength(5)],
  passwordConfirmation: [match('password'), required, minLength(5)]
};

const validate = values => validateForm(values, registerFormSchema);

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
  validate: values => validate(values),
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    resetForm({ username: '', email: '', password: '', passwordConfirmation: '' });
  },
  displayName: 'SignUpForm' // helps with React DevTools
});

export default RegisterFormWithFormik(RegisterForm);
