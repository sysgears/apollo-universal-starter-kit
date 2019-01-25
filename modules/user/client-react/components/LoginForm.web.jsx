import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { NavLink, Link } from 'react-router-dom';
import { isFormError, FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { translate } from '@gqlapp/i18n-client-react';
import { required, minLength, validate } from '@gqlapp/validation-common-react';
import { Form, RenderField, Alert, Button } from '@gqlapp/look-client-react';
import { LinkedInButton, GoogleButton, GitHubButton, FacebookButton } from '@gqlapp/authentication-client-react';

import settings from '../../../../settings';

const loginFormSchema = {
  usernameOrEmail: [required, minLength(3)],
  password: [required, minLength(8)]
};
const { github, facebook, linkedin, google } = settings.auth.social;

const renderSocialButtons = (buttonsLength, t) => {
  return buttonsLength > 2 ? (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 200 }}>
      {facebook.enabled && (
        <div className="text-center">
          <FacebookButton text={t('login.fbBtn')} type={'icon'} />
        </div>
      )}
      {google.enabled && (
        <div className="text-center">
          <GoogleButton text={t('login.googleBtn')} type={'icon'} />
        </div>
      )}
      {github.enabled && (
        <div className="text-center">
          <GitHubButton text={t('login.githubBtn')} type={'icon'} />
        </div>
      )}
      {linkedin.enabled && (
        <div className="text-center">
          <LinkedInButton text={t('login.linkedinBtn')} type={'icon'} />
        </div>
      )}
    </div>
  ) : (
    <div>
      {facebook.enabled && (
        <div className="text-center">
          <FacebookButton text={t('login.fbBtn')} type={'button'} />
        </div>
      )}
      {google.enabled && (
        <div className="text-center">
          <GoogleButton text={t('login.googleBtn')} type={'button'} />
        </div>
      )}
      {github.enabled && (
        <div className="text-center">
          <GitHubButton text={t('login.githubBtn')} type={'button'} />
        </div>
      )}
      {linkedin.enabled && (
        <div className="text-center">
          <LinkedInButton text={t('login.linkedinBtn')} type={'button'} />
        </div>
      )}
    </div>
  );
};

const LoginForm = ({ handleSubmit, submitting, errors, values, t }) => {
  const buttonsLength = [facebook.enabled, linkedin.enabled, google.enabled, github.enabled].filter(button => button)
    .length;
  return (
    <Form name="login" onSubmit={handleSubmit}>
      <Field
        name="usernameOrEmail"
        component={RenderField}
        type="text"
        label={t('login.form.field.usernameOrEmail')}
        value={values.usernameOrEmail}
      />
      <Field
        name="password"
        component={RenderField}
        type="password"
        label={t('login.form.field.pass')}
        value={values.password}
      />
      <div className="text-center">{errors && errors.errorMsg && <Alert color="error">{errors.errorMsg}</Alert>}</div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="text-center">
          <Button size="lg" style={{ minWidth: '320px' }} color="primary" type="submit" disabled={submitting}>
            {t('login.form.btnSubmit')}
          </Button>
        </div>
        {renderSocialButtons(buttonsLength, t)}
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
  t: PropTypes.func
};

const LoginFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ usernameOrEmail: '', password: '' }),

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

export default translate('user')(LoginFormWithFormik(LoginForm));
