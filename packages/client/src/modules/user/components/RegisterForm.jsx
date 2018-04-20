import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { withFormik } from 'formik';
import Field from '../../../utils/FieldAdapter';
import { Button } from '../../common/components';
import { RenderField } from '../../common/components/native';
import { match, email, minLength, required, validateForm } from '../../../../../common/validation';

const registerFormSchema = {
  username: [required, minLength(3)],
  email: [required, email],
  password: [required, minLength(8)],
  passwordConfirmation: [match('password'), required, minLength(8)]
};

const validate = values => validateForm(values, registerFormSchema);

const RegisterForm = ({ values, handleSubmit }) => {
  return (
    <View style={styles.formContainer}>
      <Field
        name="username"
        component={RenderField}
        type="text"
        placeholder="Username"
        value={values.username}
        placeholderTextColor="#8e908c"
      />
      <Field
        name="email"
        component={RenderField}
        type="email"
        placeholder="Email"
        value={values.email}
        keyboardType="email-address"
        placeholderTextColor="#8e908c"
      />
      <Field
        name="password"
        component={RenderField}
        type="password"
        placeholder="Password"
        value={values.password}
        secureTextEntry={true}
        placeholderTextColor="#8e908c"
      />
      <Field
        name="passwordConfirmation"
        component={RenderField}
        type="password"
        placeholder="Password Confirmation"
        value={values.passwordConfirmation}
        secureTextEntry={true}
        placeholderTextColor="#8e908c"
      />
      <View style={styles.submit}>
        <Button onPress={handleSubmit}>Sign Up</Button>
      </View>
    </View>
  );
};

RegisterForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  values: PropTypes.object
};

const RegisterFormWithFormik = withFormik({
  mapPropsToValues: () => ({ username: '', email: '', password: '', passwordConfirmation: '' }),
  validate: values => validate(values),
  async handleSubmit(values, { setErrors, props: { onSubmit } }) {
    onSubmit(values).catch(e => {
      setErrors(e);
    });
  },
  enableReinitialize: true,
  displayName: 'SignUpForm' // helps with React DevTools
});

const styles = StyleSheet.create({
  submit: {
    paddingTop: 30,
    paddingBottom: 15
  },
  formContainer: {
    paddingHorizontal: 20,
    justifyContent: 'center'
  }
});

export default RegisterFormWithFormik(RegisterForm);
