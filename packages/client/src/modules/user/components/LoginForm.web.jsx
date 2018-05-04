import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
//eslint-disable-next-line import/no-extraneous-dependencies
import DomainSchema from '@domain-schema/core';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik, FieldTypes, FormSchema } from '@domain-schema/formik';

import translate from '../../../i18n';
import FacebookButton from '../auth/facebook';
import GoogleButton from '../auth/google';

import settings from '../../../../../../settings';

const loginFormSchema = ({ t, submitting }) =>
  new DomainSchema(
    class extends FormSchema {
      __ = { name: 'PostForm' };
      email = {
        type: String,
        fieldType: FieldTypes.input,
        input: {
          type: 'email',
          label: t('login.form.field.email')
        },
        email: true
      };
      password = {
        type: String,
        fieldType: FieldTypes.input,
        input: {
          type: 'password',
          label: t('login.form.field.pass')
        },
        min: 4
      };
      setSubmitBtn() {
        return {
          label: t('login.form.btnSubmit'),
          color: 'primary',
          disabled: submitting
        };
      }
    }
  );

const LoginForm = ({ onSubmit, ...props }) => {
  const loginForm = new DomainSchemaFormik(loginFormSchema(props));
  const LoginFormComponent = loginForm.generateForm();
  const { t } = props;
  return (
    <React.Fragment>
      <LoginFormComponent onSubmit={async (values, { setErrors }) => await onSubmit(values).catch(e => setErrors(e))} />
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
    </React.Fragment>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  t: PropTypes.func
};

export default translate('user')(LoginForm);
