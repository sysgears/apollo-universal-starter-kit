import React from 'react';
import PropTypes from 'prop-types';
//eslint-disable-next-line import/no-extraneous-dependencies
import DomainSchema from '@domain-schema/core';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik, FieldTypes, FormSchema } from '@domain-schema/formik';

import translate from '../../../i18n';

const resetPassFormSchema = t =>
  new DomainSchema(
    class extends FormSchema {
      __ = { name: 'PostForm' };
      password = {
        type: String,
        fieldType: FieldTypes.input,
        input: {
          type: 'password',
          label: t('resetPass.form.field.pass')
        },
        min: 4
      };
      passwordConfirmation = {
        type: String,
        fieldType: FieldTypes.input,
        input: {
          type: 'password',
          label: t('resetPass.form.field.passConf')
        },
        matches: 'password'
      };
      setSubmitBtn() {
        return {
          label: t('resetPass.form.btnSubmit'),
          color: 'primary'
        };
      }
    }
  );

const ResetPasswordForm = ({ onSubmit, t }) => {
  const resetPassForm = new DomainSchemaFormik(resetPassFormSchema(t));
  const ResetPassFormComponent = resetPassForm.generateForm();

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
