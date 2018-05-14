import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
//eslint-disable-next-line import/no-extraneous-dependencies
import { Schema } from '@domain-schema/core';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik } from '@domain-schema/formik';

import translate from '../../../i18n';
import FacebookButton from '../auth/facebook';
import GoogleButton from '../auth/google';

import settings from '../../../../../../settings';

const loginFormSchema = t =>
  class extends Schema {
    __ = { name: 'PostForm' };
    email = {
      type: String,
      input: {
        type: 'email',
        label: t('login.form.field.email')
      },
      email: true
    };
    password = {
      type: String,
      input: {
        type: 'password',
        label: t('login.form.field.pass')
      },
      min: 4
    };
  };

const LoginForm = ({ onSubmit, t }) => {
  const loginForm = new DomainSchemaFormik(loginFormSchema(t));
  const LoginFormComponent = loginForm.generateForm({
    label: t('login.form.btnSubmit'),
    color: 'primary',
    disabledOnInvalid: true
  });

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
  t: PropTypes.func
};

export default translate('user')(LoginForm);
