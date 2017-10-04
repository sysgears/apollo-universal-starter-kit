import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import url from 'url';
import { Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';
import settings from '../../../../../settings';

const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
let serverPort = process.env.PORT || port;
if (__DEV__) {
  serverPort = '3000';
}

const required = value => (value ? undefined : 'Required');

const renderField = ({ input, label, type, meta: { touched, error } }) => {
  let color = 'normal';
  if (touched && error) {
    color = 'danger';
  }

  return (
    <FormGroup color={color}>
      <Label>{label}</Label>
      <div>
        <Input {...input} placeholder={label} type={type} />
        {touched && (error && <FormFeedback>{error}</FormFeedback>)}
      </div>
    </FormGroup>
  );
};

renderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};

const facebookLogin = () => {
  window.location = `${protocol}//${hostname}:${serverPort}/auth/facebook`;
};

const LoginForm = ({ handleSubmit, submitting, onSubmit, errors }) => {
  return (
    <Form name="login" onSubmit={handleSubmit(onSubmit)}>
      <Field name="email" component={renderField} type="email" label="Email" validate={required} />
      <Field name="password" component={renderField} type="password" label="Password" validate={required} />
      {errors && (
        <FormGroup color="danger">
          <FormFeedback>{errors.map(error => <li key={error.field}>{error.message}</li>)}</FormFeedback>
        </FormGroup>
      )}
      <Button color="primary" type="submit" disabled={submitting}>
        Login
      </Button>
      {settings.user.auth.facebook.enabled && (
        <Button color="primary" type="button" onClick={facebookLogin}>
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
