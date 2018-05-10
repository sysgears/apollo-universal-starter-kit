import React from 'react';
import PropTypes from 'prop-types';
//eslint-disable-next-line import/no-extraneous-dependencies
import { Schema } from '@domain-schema/core';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik } from '@domain-schema/formik';

import translate from '../../../i18n';

const registerFormSchema = t =>
  class extends Schema {
    __ = { name: 'PostForm' };
    username = {
      type: String,
      input: {
        label: t('reg.form.field.name')
      },
      min: 3
    };
    email = {
      type: String,
      input: {
        type: 'email',
        label: t('reg.form.field.email')
      },
      email: true
    };
    password = {
      type: String,
      input: {
        type: 'password',
        label: t('reg.form.field.pass')
      },
      min: 4
    };
    passwordConfirmation = {
      type: String,
      input: {
        type: 'password',
        label: t('reg.form.field.passConf')
      },
      matches: 'password'
    };
  };

const RegisterForm = ({ onSubmit, submitting, t }) => {
  const registerForm = new DomainSchemaFormik(registerFormSchema(t));
  const RegisterFormComponent = registerForm.generateForm({
    label: t('reg.form.btnSubmit'),
    color: 'primary',
    disabled: submitting
  });

  return (
    <RegisterFormComponent
      onSubmit={async (values, { setErrors }) => await onSubmit(values).catch(e => setErrors(e))}
    />
  );
};

RegisterForm.propTypes = {
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  t: PropTypes.func
};

export default translate('user')(RegisterForm);
