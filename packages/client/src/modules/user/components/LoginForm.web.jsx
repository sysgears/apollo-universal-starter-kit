import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { NavLink, Link } from 'react-router-dom';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Alert, Button } from '../../common/components/web';
import { required, minLength, validateForm } from '../../../../../common/validation';
import FacebookButton from '../auth/facebook';
import GoogleButton from '../auth/google';

import settings from '../../../../../../settings';

const loginFormSchema = {
  usernameOrEmail: [required, minLength(3)],
  password: [required, minLength(8)]
};

const validate = values => validateForm(values, loginFormSchema);

const LoginForm = ({ handleSubmit, submitting, error, values, t }) => {
  return (
    <Form name="login" onSubmit={handleSubmit}>
      <Field
        name="usernameOrEmail"
        component={RenderField}
        type="text"
        label={t('login.form.field.usenameOrEmail')}
        value={values.usernameOrEmail}
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
  error: PropTypes.string,
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
      console.log(e);
      setErrors(e);
    });
  },
  validate: values => validate(values),
  displayName: 'LoginForm' // helps with React DevTools
});

export default translate('user')(LoginFormWithFormik(LoginForm));
