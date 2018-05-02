import React from 'react';
import PropTypes from 'prop-types';
//eslint-disable-next-line import/no-extraneous-dependencies
import DomainSchema from '@domain-schema/core';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik, FormSchema } from '@domain-schema/formik';

import translate from '../../../i18n';

const forgotPassFormSchema = t =>
  new DomainSchema(
    class extends FormSchema {
      __ = { name: 'PostForm' };
      email = {
        type: String,
        fieldType: DomainSchemaFormik.fields.input,
        input: {
          type: 'email',
          label: t('forgotPass.form.fldEmail')
        },
        email: true
      };
      setSubmitBtn() {
        return {
          label: t('forgotPass.form.btnSubmit'),
          color: 'primary'
        };
      }
    }
  );

const ForgotPasswordForm = ({ onSubmit, t }) => {
  const forgotPassForm = new DomainSchemaFormik(forgotPassFormSchema(t));
  const ForgotPassFormComponent = forgotPassForm.generateForm();

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
