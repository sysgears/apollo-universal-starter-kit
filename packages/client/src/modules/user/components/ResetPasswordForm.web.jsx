import React from 'react';
import PropTypes from 'prop-types';
//eslint-disable-next-line import/no-extraneous-dependencies
import { Schema } from '@domain-schema/core';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik } from '@domain-schema/formik';

import translate from '../../../i18n';

const resetPassFormSchema = t =>
  class extends Schema {
    __ = { name: 'PostForm' };
    password = {
      type: String,
      input: {
        type: 'password',
        label: t('resetPass.form.field.pass')
      },
      min: 8
    };
    passwordConfirmation = {
      type: String,
      input: {
        type: 'password',
        label: t('resetPass.form.field.passConf')
      },
      matches: 'password'
    };
  };

const ResetPasswordForm = ({ onSubmit, t }) => {
  const resetPassForm = new DomainSchemaFormik(resetPassFormSchema(t));
  const ResetPassFormComponent = resetPassForm.generateForm({
    label: t('resetPass.form.btnSubmit'),
    color: 'primary'
  });

  return (
    <ResetPassFormComponent
      onSubmit={async (values, { setErrors }) => await onSubmit(values).catch(e => setErrors(e))}
    />
  );
};

ResetPasswordForm.propTypes = {
  onSubmit: PropTypes.func,
  t: PropTypes.func
};

export default translate('user')(ResetPasswordForm);
