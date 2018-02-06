import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import url from 'url';
import { NavLink, Link } from 'react-router-dom';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Alert, Button } from '../../common/components/web';
import { required, email, minLength, validateForm } from '../../../../../common/validation';

import settings from '../../../../../../settings';

const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
let serverPort = process.env.PORT || port;
if (__DEV__) {
  serverPort = '3000';
}

const facebookLogin = () => {
  window.location = `${protocol}//${hostname}:${serverPort}/auth/facebook`;
};

const googleLogin = () => {
  window.location = `${protocol}//${hostname}:${serverPort}/auth/google`;
};

const contactFormSchema = {
  email: [required, email],
  password: [required, minLength(5)]
};

const validate = values => validateForm(values, contactFormSchema);

const LoginForm = ({ handleSubmit, submitting, error, handleChange, values }) => {
  return (
    <Form name="login" onSubmit={handleSubmit}>
      <Field
        name="email"
        component={RenderField}
        type="email"
        label="Email"
        onChange={handleChange}
        value={values.email}
      />
      <Field
        name="password"
        component={RenderField}
        type="password"
        label="Password"
        onChange={handleChange}
        value={values.password}
      />
      <div className="text-center">{error && <Alert color="error">{error}</Alert>}</div>
      <div className="text-center">
        <Button color="primary" type="submit" disabled={submitting}>
          Login
        </Button>
        {settings.user.auth.facebook.enabled && (
          <Button color="primary" type="button" onClick={facebookLogin} style={{ margin: 10 }}>
            Login with Facebook
          </Button>
        )}
        {settings.user.auth.google.enabled && (
          <Button color="primary" type="button" onClick={googleLogin} style={{ margin: 10 }}>
            Login with Google
          </Button>
        )}
      </div>
      <Link className="text-center" to="/forgot-password">
        Forgot your password?
      </Link>
      <hr />
      <div style={{ marginBottom: 16 }}>
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
  handleChange: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  values: PropTypes.object
};

const LoginFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ email: '', password: '' }),
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    resetForm();
  },
  validate: values => validate(values),
  displayName: 'LoginForm' // helps with React DevTools
});

export default LoginFormWithFormik(LoginForm);
