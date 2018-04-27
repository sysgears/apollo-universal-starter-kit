import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { withFormik } from 'formik';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { RenderField, placeholderColor, Button, primary } from '../../common/components/native';
import { required, email, minLength, validateForm } from '../../../../../common/validation';
import FacebookButton from '../auth/facebook';
import GoogleButton from '../auth/google';
import settings from '../../../../../../settings';

const loginFormSchema = {
  email: [required, email],
  password: [required, minLength(8)]
};

const validate = values => validateForm(values, loginFormSchema);

const LoginForm = ({ handleSubmit, valid, values, navigation, t }) => {
  return (
    <View style={styles.formContainer}>
      <View style={styles.form}>
        <View>
          <View>
            <Field
              autoCapitalize="none"
              autoCorrect={false}
              name="email"
              component={RenderField}
              type="email"
              keyboardType="email-address"
              placeholder={t('mobile.login.email.placeholder')}
              placeholderTextColor={placeholderColor}
              value={values.email}
            />
            <Field
              autoCapitalize="none"
              autoCorrect={false}
              name="password"
              component={RenderField}
              type="password"
              secureTextEntry={true}
              placeholder={t('mobile.login.pass.placeholder')}
              placeholderTextColor={placeholderColor}
              value={values.password}
            />
          </View>
          <View style={styles.submit}>
            <Button type={primary} onPress={handleSubmit} disabled={valid}>
              {t('login.form.btnSubmit')}
            </Button>
          </View>
          <View>
            {settings.user.auth.facebook.enabled && <FacebookButton type="button" />}
            {settings.user.auth.google.enabled && <GoogleButton type="button" />}
          </View>
          <View style={styles.buttonsGroup}>
            <Text style={styles.signUpText} onPress={() => navigation.navigate('ForgotPassword')}>
              {t('login.btn.forgotPass')}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        <Text style={styles.text}>{t('login.notRegText')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signUpText}>{t('login.btn.sign')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  valid: PropTypes.bool,
  values: PropTypes.object,
  navigation: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  t: PropTypes.func
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1
  },
  form: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    flex: 9
  },
  submit: {
    paddingTop: 30,
    paddingBottom: 15
  },
  buttonsGroup: {
    flex: 1,
    paddingTop: 10
  },
  buttonWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  text: {
    fontSize: 14,
    color: '#bcb8b8'
  },
  signUpText: {
    fontSize: 16,
    paddingLeft: 3,
    color: '#8e908c',
    fontWeight: '600',
    textDecorationLine: 'underline',
    textAlign: 'center'
  }
});

const LoginFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ email: '', password: '' }),
  handleSubmit(values, { setErrors, props: { onSubmit } }) {
    onSubmit(values).catch(e => {
      setErrors(e);
    });
  },
  validate: values => validate(values),
  displayName: 'LoginForm' // helps with React DevTools
});

export default translate('user')(LoginFormWithFormik(LoginForm));
