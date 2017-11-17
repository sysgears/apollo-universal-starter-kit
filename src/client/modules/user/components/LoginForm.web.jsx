import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import url from 'url';
import { NavLink, Link } from 'react-router-dom';
import { Form, RenderField, Alert, Button } from '../../common/components/web';

import settings from '../../../../../settings';

const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
let serverPort = process.env.PORT || port;
if (__DEV__) {
  serverPort = '3000';
}

const required = value => (value ? undefined : 'Required');

const facebookLogin = () => {
  window.location = `${protocol}//${hostname}:${serverPort}/auth/facebook`;
};

const LoginForm = ({ handleSubmit, submitting, onSubmit, error }) => {
  return (
    <Form name="login" onSubmit={handleSubmit(onSubmit)}>
      <Field name="email" component={RenderField} type="email" label="Email" validate={required} />
      <Field name="password" component={RenderField} type="password" label="Password" validate={required} />
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
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string
};

export default reduxForm({
  form: 'login'
})(LoginForm);
