import React from 'react';
import PropTypes from 'prop-types';
//eslint-disable-next-line import/no-extraneous-dependencies
import DomainSchema from '@domain-schema/core';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik, FieldTypes, FormSchema } from '@domain-schema/formik';

import translate from '../../../i18n';

const registerFormSchema = ({ t, submitting }) =>
  new DomainSchema(
    class extends FormSchema {
      __ = { name: 'PostForm' };
      username = {
        type: String,
        fieldType: FieldTypes.input,
        input: {
          label: t('reg.form.field.name')
        },
        min: 3
      };
      email = {
        type: String,
        fieldType: FieldTypes.input,
        input: {
          type: 'email',
          label: t('reg.form.field.email')
        },
        email: true
      };
      password = {
        type: String,
        fieldType: FieldTypes.input,
        input: {
          type: 'password',
          label: t('reg.form.field.pass')
        },
        min: 4
      };
      passwordConfirmation = {
        type: String,
        fieldType: FieldTypes.input,
        input: {
          type: 'password',
          label: t('reg.form.field.passConf')
        },
        matches: 'password'
      };
      setSubmitBtn() {
        return {
          label: t('reg.form.btnSubmit'),
          color: 'primary',
          disabled: submitting
        };
      }
    }
  );

const RegisterForm = ({ onSubmit, ...props }) => {
  const registerForm = new DomainSchemaFormik(registerFormSchema(props));
  const RegisterFormComponent = registerForm.generateForm();

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
