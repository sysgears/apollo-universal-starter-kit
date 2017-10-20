import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import url from 'url';
import { Form, RenderField, RenderErrors, Button } from '../../common/components/web';

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

const LoginForm = ({ handleSubmit, submitting, onSubmit, errors }) => {
  return (
    <Form name="login" onSubmit={handleSubmit(onSubmit)}>
      <Field name="email" component={RenderField} type="email" label="Email" validate={required} />
      <Field name="password" component={RenderField} type="password" label="Password" validate={required} />
      <RenderErrors errors={errors} />
      <Button color="primary" type="submit" disabled={submitting}>
        Login
      </Button>
      {settings.user.auth.facebook.enabled && (
        <Button color="primary" type="button" onClick={facebookLogin} style={{ marginLeft: 10 }}>
          Login with Facebook
        </Button>
      )}
    </Form>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  errors: PropTypes.array
};

export default reduxForm({
  form: 'login'
})(LoginForm);
