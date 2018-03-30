import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { withFormik } from 'formik';
import { translate } from 'react-i18next';

import Field from '../../../utils/FieldAdapter';
import { Button } from '../../common/components';
import { RenderField } from '../../common/components/native';
import { required, email, minLength, validateForm } from '../../../../../common/validation';
import FacebookButton from '../auth/facebook';
import GoogleButton from '../auth/google';
import settings from '../../../../../../settings';

const loginFormSchema = {
  email: [required, email],
  password: [required, minLength(5)]
};

const validate = values => validateForm(values, loginFormSchema);

const LoginForm = ({ handleSubmit, valid, values, t }) => {
  return (
    <View style={styles.form}>
      <Field
        autoCapitalize="none"
        autoCorrect={false}
        name="email"
        component={RenderField}
        type="email"
        keyboardType="email-address"
        label={t('mobile.login.email.label')}
        placeholder={t('mobile.login.email.placeholder')}
        value={values.email}
      />
      <Field
        autoCapitalize="none"
        autoCorrect={false}
        name="password"
        component={RenderField}
        type="password"
        secureTextEntry={true}
        label={t('mobile.login.pass.label')}
        placeholder={t('mobile.login.pass.placeholder')}
        value={values.password}
      />
      <Button style={styles.submit} onPress={handleSubmit} disabled={valid}>
        {t('login.form.btnSubmit')}
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
  values: PropTypes.object,
  t: PropTypes.func
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
  async handleSubmit(values, { setErrors, props: { onSubmit } }) {
    await onSubmit(values).catch(e => {
      setErrors(e);
    });
  },
  validate: values => validate(values),
  displayName: 'LoginForm' // helps with React DevTools
});

export default translate('user')(LoginFormWithFormik(LoginForm));
