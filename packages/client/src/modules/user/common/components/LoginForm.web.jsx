import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { NavLink, Link } from 'react-router-dom';
import Field from '../../../../utils/FieldAdapter';
import { Form, RenderField, Alert, Button } from '../../../common/components/web/index';
import { required, email, minLength, validateForm } from '../../../../../../common/validation';
import FacebookButton from '../../modules/facebook/index.web';
import GoogleButton from '../../modules/google/index.web';

import settings from '../../../../../../../settings';

const contactFormSchema = {
  email: [required, email],
  password: [required, minLength(5)]
};

const validate = values => validateForm(values, contactFormSchema);

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
          <FacebookButton type={'icon'} />
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
  async handleSubmit(values, { props: { onSubmit } }) {
    await onSubmit(values);
  },
  validate: values => validate(values),
  displayName: 'LoginForm' // helps with React DevTools
});

export default LoginFormWithFormik(LoginForm);
