import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { NavLink, Link } from 'react-router-dom';

import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Alert, Button } from '../../common/components/web';
import { required, email, minLength, validateForm } from '../../../../../common/validation';
import FacebookButton from '../auth/facebook';
import GoogleButton from '../auth/google';

import settings from '../../../../../../settings';

const loginFormSchema = {
  email: [required, email],
  password: [required, minLength(8)]
};

const validate = values => validateForm(values, loginFormSchema);

const LoginForm = ({ handleSubmit, submitting, error, values }) => {
  return (
    <Form name="login" onSubmit={handleSubmit}>
      <Field name="email" component={RenderField} type="email" label="Email" value={values.email} />
      <Field name="password" component={RenderField} type="password" label="Password" value={values.password} />
      <div className="text-center">{error && <Alert color="error">{error}</Alert>}</div>
      <div className="text-center">
        <Button color="primary" type="submit" disabled={submitting}>
          Login
        </Button>
      </div>
      {settings.user.auth.facebook.enabled && (
        <div className="text-center">
          <FacebookButton type={'button'} />
        </div>
      )}
      {settings.user.auth.google.enabled && (
        <div className="text-center">
          <GoogleButton type={'button'} />
        </div>
      )}
      <div className="text-center" style={{ marginTop: 10 }}>
        <Link to="/forgot-password">Forgot your password?</Link>
      </div>
      <hr />
      <div className="text-center" style={{ marginBottom: 16 }}>
        <span style={{ lineHeight: '58px' }}>Not registered yet?</span>
        <NavLink className="btn btn-primary" to="/register" activeClassName="active" style={{ margin: 10 }}>
          Sign Up
        </NavLink>
      </div>
    </Form>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  values: PropTypes.object
};

const LoginFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ email: '', password: '' }),
  async handleSubmit(values, { setErrors, props: { onSubmit } }) {
    await onSubmit(values).catch(e => {
      console.log(e);
      setErrors(e);
    });
  },
  validate: values => validate(values),
  displayName: 'LoginForm' // helps with React DevTools
});

export default LoginFormWithFormik(LoginForm);
