import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import url from 'url';
import { NavLink, Link } from 'react-router-dom';
import { translate } from 'react-i18next';

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

const LoginForm = ({ handleSubmit, submitting, error, values, t }) => {
  return (
    <Form name="login" onSubmit={handleSubmit}>
      <Field
        name="email"
        component={RenderField}
        type="email"
        label={t('login.form.field.email')}
        value={values.email}
      />
      <Field
        name="password"
        component={RenderField}
        type="password"
        label={t('login.form.field.pass')}
        value={values.password}
      />
      <div className="text-center">{error && <Alert color="error">{error}</Alert>}</div>
      <div className="text-center">
        <Button color="primary" type="submit" disabled={submitting}>
          {t('login.form.btnSubmit')}
        </Button>
        {settings.user.auth.facebook.enabled && (
          <Button color="primary" type="button" onClick={facebookLogin} style={{ margin: 10 }}>
            {t('login.btn.fb')}
          </Button>
        )}
        {settings.user.auth.google.enabled && (
          <Button color="primary" type="button" onClick={googleLogin} style={{ margin: 10 }}>
            {t('login.btn.google')}
          </Button>
        )}
      </div>
      <Link className="text-center" to="/forgot-password">
        {t('login.btn.forgotPass')}
      </Link>
      <hr />
      <div style={{ marginBottom: 16 }}>
        <span style={{ lineHeight: '58px' }}>{t('login.btn.notReg')}</span>
        <NavLink className="btn btn-primary" to="/register" activeClassName="active" style={{ margin: 10 }}>
          {t('login.btn.sign')}
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
  values: PropTypes.object,
  t: PropTypes.func
};

const LoginFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ email: '', password: '' }),
  async handleSubmit(values, { setErrors, resetForm, props: { onSubmit } }) {
    await onSubmit(values)
      .then(() => resetForm())
      .catch(e => {
        setErrors(e);
      });
  },
  validate: values => validate(values),
  displayName: 'LoginForm' // helps with React DevTools
});

export default translate('user')(LoginFormWithFormik(LoginForm));
