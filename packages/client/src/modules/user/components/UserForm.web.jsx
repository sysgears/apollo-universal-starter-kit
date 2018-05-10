import React from 'react';
import PropTypes from 'prop-types';
//eslint-disable-next-line import/no-extraneous-dependencies
import { Schema } from '@domain-schema/core';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik } from '@domain-schema/formik';

import translate from '../../../i18n';

import settings from '../../../../../../settings';

const getProfile = (t, profile) =>
  class Profile extends Schema {
    __ = { name: 'Profile' };
    firstName = {
      type: String,
      input: {
        label: t('userEdit.form.field.firstName')
      },
      defaultValue: profile && profile.firstName,
      optional: true
    };
    lastName = {
      type: String,
      input: {
        label: t('userEdit.form.field.lastName')
      },
      defaultValue: profile && profile.lastName,
      optional: true
    };
  };

const userFormSchema = ({ t, user: { username, email, isActive, role, profile, auth } }) =>
  class extends Schema {
    __ = { name: 'UserForm' };
    username = {
      type: String,
      input: {
        label: t('userEdit.form.field.name')
      },
      defaultValue: username,
      min: 3
    };
    email = {
      type: String,
      input: {
        type: 'email',
        label: t('userEdit.form.field.email')
      },
      defaultValue: email,
      email: true
    };
    role = {
      type: String,
      fieldType: 'select',
      input: {
        label: t('userEdit.form.field.role.label'),
        values: [
          { value: 'user', label: t('userEdit.form.field.role.user') },
          { value: 'admin', label: t('userEdit.form.field.role.admin') }
        ]
      },
      defaultValue: role || 'user',
      optional: true
    };
    isActive = {
      type: Boolean,
      fieldType: 'checkbox',
      input: {
        label: t('userEdit.form.field.active')
      },
      defaultValue: isActive,
      optional: true
    };
    profile = {
      type: getProfile(t, profile)
    };
    serial = {
      type: String,
      input: {
        label: t('userEdit.form.field.serial')
      },
      defaultValue: auth && auth.certificate && auth.certificate.serial,
      ignore: !settings.user.auth.certificate.enabled,
      optional: true
    };
    password = {
      type: String,
      input: {
        type: 'password',
        label: t('userEdit.form.field.pass')
      },
      min: 4
    };
    passwordConfirmation = {
      type: String,
      input: {
        type: 'password',
        label: t('userEdit.form.field.passConf')
      },
      matches: 'password'
    };
    setSubmitBtn() {
      return {
        label: t('userEdit.form.btnSubmit'),
        color: 'primary'
      };
    }
  };

const UserForm = ({ onSubmit, t, user }) => {
  const userForm = new DomainSchemaFormik(userFormSchema({ t, user }));
  const UserFormComponent = userForm.generateForm({
    label: t('userEdit.form.btnSubmit'),
    color: 'primary'
  });

  return (
    <UserFormComponent
      onSubmit={async ({ serial, ...values }, { setErrors }) =>
        await onSubmit({ ...values, auth: { ...user.auth, certificate: serial ? { serial } : null } }).catch(e =>
          setErrors(e)
        )
      }
    />
  );
};

UserForm.propTypes = {
  onSubmit: PropTypes.func,
  user: PropTypes.object,
  t: PropTypes.func
};

export default translate('user')(UserForm);
