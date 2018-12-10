import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { View, StyleSheet } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { FieldAdapter as Field } from '@module/core-client-react';
import { translate } from '@module/i18n-client-react';

import { RenderField, Button, RenderSelect, RenderSwitch, FormView, primary } from '@module/look-client-react-native';
import { placeholderColor, submit } from '@module/look-client-react-native/styles';
import { email, minLength, required, match, validate } from '@module/validation-common-react';
import settings from '../../../../settings';

const userFormSchema = {
  username: [required, minLength(3)],
  email: [required, email],
  password: [required, minLength(settings.user.auth.password.minLength)],
  passwordConfirmation: [match('password'), required, minLength(settings.user.auth.password.minLength)]
};

const handleRoleChange = (type, value, setFieldValue) => {
  const preparedValue = Array.isArray(value) ? value[0] : value;
  setFieldValue(type, preparedValue);
};

const UserForm = ({ values, handleSubmit, setFieldValue, t, shouldDisplayRole, shouldDisplayActive }) => {
  const options = [
    {
      value: 'user',
      label: t('userEdit.form.field.role.user')
    },
    {
      value: 'admin',
      label: t('userEdit.form.field.role.admin')
    }
  ];

  const { username, email, role, isActive, profile, auth, password, passwordConfirmation } = values;
  return (
    <FormView contentContainerStyle={{ flexGrow: 1 }} style={styles.formView}>
      <View style={styles.formContainer}>
        <Field
          placeholder={t('userEdit.form.field.name')}
          name="username"
          component={RenderField}
          type="text"
          value={username}
          placeholderTextColor={placeholderColor}
        />
        <Field
          name="email"
          component={RenderField}
          placeholder={t('userEdit.form.field.email')}
          value={email}
          keyboardType="email-address"
          placeholderTextColor={placeholderColor}
        />
        {shouldDisplayRole && (
          <Field
            name="role"
            component={RenderSelect}
            label={t('userEdit.form.field.role.label')}
            okText={t('userEdit.select.okText')}
            dismissText={t('userEdit.select.dismissText')}
            placeholderTextColor={placeholderColor}
            selectedValue={role}
            onChange={value => handleRoleChange('role', value, setFieldValue)}
            cols={1}
            data={options}
          />
        )}
        {shouldDisplayActive && (
          <Field
            name="isActive"
            label={t('userEdit.form.field.active')}
            onChange={() => setFieldValue('isActive', !isActive)}
            component={RenderSwitch}
            placeholder={t('userEdit.form.field.active')}
            checked={isActive}
            placeholderTextColor={placeholderColor}
          />
        )}
        <Field
          name="firstName"
          component={RenderField}
          placeholder={t('userEdit.form.field.firstName')}
          placeholderTextColor={placeholderColor}
          value={profile.firstName}
          onChange={value => setFieldValue('profile', { ...profile, firstName: value })}
        />
        <Field
          name="lastName"
          component={RenderField}
          placeholder={t('userEdit.form.field.lastName')}
          placeholderTextColor={placeholderColor}
          value={profile.lastName}
          onChange={value => setFieldValue('profile', { ...profile, lastName: value })}
        />
        {settings.user.auth.certificate.enabled && (
          <Field
            name="serial"
            component={RenderField}
            placeholder={t('userEdit.form.field.serial')}
            placeholderTextColor={placeholderColor}
            value={auth && auth.certificate && auth.certificate.serial}
            onChange={value => setFieldValue('auth', { ...auth, certificate: { ...auth.certificate, serial: value } })}
          />
        )}
        <Field
          name="password"
          secureTextEntry={true}
          component={RenderField}
          type="password"
          placeholder={t('userEdit.form.field.pass')}
          placeholderTextColor={placeholderColor}
          value={password}
        />
        <Field
          name="passwordConfirmation"
          component={RenderField}
          placeholder={t('userEdit.form.field.passConf')}
          placeholderTextColor={placeholderColor}
          value={passwordConfirmation}
          type="password"
          secureTextEntry={true}
        />
        <View style={styles.submit}>
          <Button type={primary} onPress={handleSubmit}>
            {t('userEdit.form.btnSubmit')}
          </Button>
        </View>
      </View>
      <KeyboardSpacer />
    </FormView>
  );
};

UserForm.propTypes = {
  handleSubmit: PropTypes.func,
  t: PropTypes.func,
  handleChange: PropTypes.func,
  setFieldValue: PropTypes.func,
  onSubmit: PropTypes.func,
  setTouched: PropTypes.func,
  isValid: PropTypes.bool,
  error: PropTypes.string,
  shouldDisplayRole: PropTypes.bool,
  shouldDisplayActive: PropTypes.bool,
  values: PropTypes.object,
  errors: PropTypes.object,
  initialValues: PropTypes.object.isRequired,
  touched: PropTypes.object
};

const UserFormWithFormik = withFormik({
  mapPropsToValues: values => {
    const { username, email, role, isActive, profile } = values.initialValues;
    return {
      username: username,
      email: email,
      role: role || 'user',
      isActive: isActive,
      password: '',
      passwordConfirmation: '',
      profile: {
        firstName: profile && profile.firstName,
        lastName: profile && profile.lastName
      },
      auth: {
        ...values.initialValues.auth
      }
    };
  },
  handleSubmit(
    values,
    {
      setErrors,
      props: { onSubmit }
    }
  ) {
    onSubmit(values).catch(e => setErrors(e));
  },
  displayName: 'SignUpForm ', // helps with React DevTools
  validate: values => validate(values, userFormSchema)
});

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    flex: 1
  },
  submit,
  formView: {
    flex: 1,
    alignSelf: 'stretch'
  }
});

export default translate('user')(UserFormWithFormik(UserForm));
