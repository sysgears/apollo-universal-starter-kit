import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { withFormik } from 'formik';
import Field from '../../../../utils/FieldAdapter';
import { Button } from '../../../common/components/index';
import { RenderField } from '../../../common/components/native/index';
import { required, email, minLength, validateForm } from '../../../../../../common/validation';
import FacebookButton from '../../modules/facebook';
import GoogleButton from '../../modules/google';
import settings from '../../../../../../../settings';

const contactFormSchema = {
  email: [required, email],
  password: [required, minLength(5)]
};

const validate = values => validateForm(values, contactFormSchema);

const LoginForm = ({ handleSubmit, valid, values }) => {
  return (
    <View style={styles.form}>
      <Field
        autoCapitalize="none"
        autoCorrect={false}
        name="email"
        component={RenderField}
        type="email"
        keyboardType="email-address"
        label="Email"
        placeholder="Type Your Email"
        value={values.email}
      />
      <Field
        autoCapitalize="none"
        autoCorrect={false}
        name="password"
        component={RenderField}
        type="password"
        secureTextEntry={true}
        label="Password"
        placeholder="Type Your Password"
        value={values.password}
      />
      <Button style={styles.submit} onPress={handleSubmit} disabled={valid}>
        Sign In
      </Button>
      {settings.user.auth.facebook.enabled && <FacebookButton type="icon" />}
      {settings.user.auth.google.enabled && <GoogleButton type="icon" />}
    </View>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  valid: PropTypes.bool,
  values: PropTypes.object
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    margin: 10
  },
  form: {
    flex: 0.8,
    alignItems: 'stretch'
  },
  submit: {
    marginTop: 10,
    alignSelf: 'center'
  }
});

const LoginFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ email: '', password: '' }),
  async handleSubmit(values, { props: { onSubmit } }) {
    await onSubmit(values);
  },
  validate: values => validate(values),
  displayName: 'LoginForm' // helps with React DevTools
});

export default LoginFormWithFormik(LoginForm);
