import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { NavLink, Link } from 'react-router-dom';
import { isFormError, FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { translate } from '@gqlapp/i18n-client-react';
import { required, minLength, validate, email } from '@gqlapp/validation-common-react';
import { Form, RenderField, Alert, Button } from '@gqlapp/look-client-react';

import FacebookButton from '../auth/facebook';
import GoogleButton from '../auth/google';
import GitHubButton from '../auth/github';

import settings from '../../../../settings';

const loginFormSchema = {
  email: [required, email],
  password: [required, minLength(8)]
};

const { facebook, google, github } = settings.firebase;

const renderSocialButtons = (buttonsLength, t, loader) => {
  return buttonsLength > 2 ? (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 200 }}>
      {settings.firebase.facebook.enabled && (
        <div className="text-center">
          <FacebookButton text={t('login.fbBtn')} type={'icon'} />
        </div>
      )}
      {settings.firebase.google.enabled && (
        <div className="text-center">
          <GoogleButton text={t('login.googleBtn')} type={'icon'} />
        </div>
      )}
      {settings.firebase.github.enabled && (
        <div className="text-center">
          <GitHubButton text={t('login.githubBtn')} type={'icon'} />
        </div>
      )}
    </div>
  ) : (
    <div>
      {settings.firebase.facebook.enabled && (
        <div className="text-center">
          <FacebookButton text={t('login.fbBtn')} type={'button'} />
        </div>
      )}
      {settings.firebase.google.enabled && (
        <div className="text-center">
          <GoogleButton text={t('login.googleBtn')} type={'button'} />
        </div>
      )}
      {settings.firebase.github.enabled && (
        <div className="text-center">
          <GitHubButton text={t('login.githubBtn')} type={'button'} />
        </div>
      )}
      {loader && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            zIndex: '1000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Alert color="error">
            <div className="text-center">{t('login.waiting')}</div>
          </Alert>
        </div>
      )}
    </div>
  );
};

const LoginForm = ({ handleSubmit, submitting, errors, values, t, firebaseError, loader }) => {
  const buttonsLength = [facebook.enabled, google.enabled, github.enabled].filter(button => button).length;
  return (
    <Form name="login" onSubmit={handleSubmit}>
      <Field
        name="email"
        component={RenderField}
        type="text"
        label={t('login.form.firebase.email')}
        value={values.email}
      />
      <Field
        name="password"
        component={RenderField}
        type="password"
        label={t('login.form.firebase.pass')}
        value={values.password}
      />
      <div className="text-center">{errors && errors.errorMsg && <Alert color="error">{errors.errorMsg}</Alert>}</div>
      <div className="text-center">
        {firebaseError && <Alert color="error">{t('login.form.firebase.accountExist')}</Alert>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="text-center">
          <Button size="lg" style={{ minWidth: '320px' }} color="primary" type="submit" disabled={submitting}>
            {t('login.form.btnSubmit')}
          </Button>
        </div>
        {renderSocialButtons(buttonsLength, t, loader)}
      </div>

      <div className="text-center" style={{ marginTop: 10 }}>
        <Link to="/forgot-password">{t('login.btn.forgotPass')}</Link>
      </div>
      <hr />
      <div className="text-center" style={{ marginBottom: 16 }}>
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
  errors: PropTypes.object,
  values: PropTypes.object,
  t: PropTypes.func,
  firebaseError: PropTypes.bool,
  loader: PropTypes.bool
};

const LoginFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ email: '', password: '' }),

  handleSubmit(
    values,
    {
      setErrors,
      props: { onSubmit }
    }
  ) {
    onSubmit(values).catch(e => {
      if (isFormError(e)) {
        setErrors(e.errors);
      } else {
        throw e;
      }
    });
  },
  validate: values => validate(values, loginFormSchema),
  displayName: 'LoginForm' // helps with React DevTools
});

export default translate('firebase')(LoginFormWithFormik(LoginForm));
