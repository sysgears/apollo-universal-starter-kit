import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { View, StyleSheet } from 'react-native';
import Field from '../../../utils/FieldAdapter';
import { RenderField, Button, RenderSelect, RenderSwitch } from '../../common/components/native';
import { email, minLength, required, match, validateForm } from '../../../../../common/validation';

import settings from '../../../../../../settings';

const userFormSchema = {
  username: [required, minLength(3)],
  email: [required, email],
  password: [required, minLength(8)],
  passwordConfirmation: [match('password'), required, minLength(8)]
};

const handleRoleChange = (type, value, setFieldValue) => {
  const preparedValue = Array.isArray(value) ? value[0] : value;
  setFieldValue(type, preparedValue);
};

const validate = values => validateForm(values, userFormSchema);

const UserForm = ({ values, handleSubmit, setFieldValue }) => {
  const { username, email, role, isActive, profile, auth, password, passwordConfirmation } = values;
  return (
    <View style={styles.formContainer}>
      <Field placeholder="User name" name="username" component={RenderField} type="text" value={username} />
      <Field name="email" component={RenderField} placeholder="Email" value={email} keyboardType="email-address" />
      <Field
        name="isActive"
        label="Is Active"
        onValueChange={() => setFieldValue('isActive', !isActive)}
        component={RenderSwitch}
        placeholder="Is Active"
        checked={isActive}
      />
      <Field
        name="role"
        component={RenderSelect}
        placeholder="Select role"
        selectedValue={role}
        onValueChange={value => handleRoleChange('role', value, setFieldValue)}
        cols={1}
        data={[{ value: 'user', label: 'user' }, { value: 'admin', label: 'admin' }]}
      />
      <Field
        name="firstName"
        component={RenderField}
        placeholder="First Name"
        value={profile.firstName}
        onChange={value => setFieldValue('profile', { ...profile, firstName: value })}
      />
      <Field
        name="lastName"
        component={RenderField}
        placeholder="Last Name"
        value={profile.lastName}
        onChange={value => setFieldValue('profile', { ...profile, lastName: value })}
      />
      {settings.user.auth.certificate.enabled && (
        <Field
          name="serial"
          component={RenderField}
          placeholder="Serial"
          value={auth && auth.certificate && auth.certificate.serial}
          onChange={value => setFieldValue('auth', { ...auth, certificate: { ...auth.certificate, serial: value } })}
        />
      )}
      <Field
        name="password"
        secureTextEntry={true}
        component={RenderField}
        type="password"
        placeholder="Password"
        value={password}
      />
      <Field
        name="passwordConfirmation"
        component={RenderField}
        placeholder="Password Confirmation"
        value={passwordConfirmation}
        secureTextEntry={true}
      />
      <View style={styles.submit}>
        <Button type="primary" onPress={handleSubmit}>
          Save
        </Button>
      </View>
    </View>
  );
};

UserForm.propTypes = {
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  setFieldValue: PropTypes.func,
  onSubmit: PropTypes.func,
  setTouched: PropTypes.func,
  isValid: PropTypes.bool,
  error: PropTypes.string,
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
  async handleSubmit(values, { setErrors, props: { onSubmit } }) {
    await onSubmit(values).catch(e => setErrors(e));
  },
  displayName: 'SignUpForm ', // helps with React DevTools
  validate: values => validate(values)
});

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  submit: {
    paddingTop: 30,
    paddingBottom: 15
  }
});

export default UserFormWithFormik(UserForm);
