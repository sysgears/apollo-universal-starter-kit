import React from 'react';
import PropTypes from 'prop-types';
//eslint-disable-next-line import/no-extraneous-dependencies
import { Schema } from '@domain-schema/core';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik } from '@domain-schema/formik';

import translate from '../../../i18n';

const forgotPassFormSchema = t =>
  class extends Schema {
    __ = { name: 'PostForm' };
    email = {
      type: String,
      input: {
        type: 'email',
        label: t('forgotPass.form.fldEmail')
      },
      email: true
    };
  };

const ForgotPasswordForm = ({ onSubmit, t }) => {
  const forgotPassForm = new DomainSchemaFormik(forgotPassFormSchema(t));
  const ForgotPassFormComponent = forgotPassForm.generateForm({
    label: t('forgotPass.form.btnSubmit'),
    color: 'primary'
  });

  return (
    <ForgotPassFormComponent
      onSubmit={async (values, { setErrors }) => await onSubmit(values).catch(e => setErrors(e))}
    />
  );
};

ForgotPasswordForm.propTypes = {
  onSubmit: PropTypes.func,
  t: PropTypes.func
};

export default translate('user')(ForgotPasswordForm);
