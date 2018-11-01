import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { withFormik } from 'formik';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { RenderField, Button, primary, FormView } from '../../common/components/native';
import { placeholderColor, submit } from '../../common/components/native/styles';
import { required, minLength, validate } from '../../../../../common/modules/validation';
import FacebookButton from '../auth/facebook';
import GoogleButton from '../auth/google';
import GitHubButton from '../auth/github';
import LinkedInButton from '../auth/linkedin';
import settings from '../../../../../../settings';

const loginFormSchema = {
  usernameOrEmail: [required, minLength(3)],
  password: [required, minLength(settings.user.auth.password.minLength)]
};
const { facebook, linkedin, google, github } = settings.user.auth;

const renderSocialButtons = (buttonsLength, t) => {
  return buttonsLength > 2 ? (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      {facebook.enabled && <FacebookButton text={t('login.fbBtn')} type="icon" />}
      {google.enabled && <GoogleButton text={t('login.googleBtn')} type="icon" />}
      {github.enabled && <GitHubButton text={t('login.githubBtn')} type="icon" />}
      {linkedin.enabled && <LinkedInButton text={t('login.linkedinBtn')} type="icon" />}
    </View>
  ) : buttonsLength > 0 ? (
    <View>
      {facebook.enabled && <FacebookButton text={t('login.fbBtn')} type="button" />}
      {google.enabled && <GoogleButton text={t('login.googleBtn')} type="button" />}
      {github.enabled && <GitHubButton text={t('login.githubBtn')} type="button" />}
      {linkedin.enabled && <LinkedInButton text={t('login.linkedinBtn')} type="button" />}
    </View>
  ) : null;
};

const LoginForm = ({ handleSubmit, valid, values, navigation, t }) => {
  const buttonsLength = [facebook.enabled, linkedin.enabled, google.enabled, github.enabled].filter(button => button)
    .length;
  return (
    <FormView contentContainerStyle={{ flexGrow: 1 }} style={styles.formView}>
      <View style={styles.formContainer}>
        <View style={styles.form}>
          <View>
            <View>
              <Field
                autoCapitalize="none"
                autoCorrect={false}
                name="usernameOrEmail"
                component={RenderField}
                type="text"
                keyboardType="email-address"
                placeholder={t('mobile.login.usernameOrEmail.placeholder')}
                placeholderTextColor={placeholderColor}
                value={values.usernameOrEmail}
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
            {renderSocialButtons(buttonsLength, t)}
            <View style={styles.buttonsGroup}>
              <Text style={styles.signUpText} onPress={() => navigation.navigate('ForgotPassword')}>
                {t('login.btn.forgotPass')}
              </Text>
            </View>
            <KeyboardSpacer />
          </View>
        </View>
        <View style={styles.buttonWrapper}>
          <Text style={styles.text}>{t('login.notRegText')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signUpText}>{t('login.btn.sign')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </FormView>
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
  formView: {
    flex: 1,
    alignSelf: 'stretch'
  },
  form: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    flex: 9
  },
  submit,
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
  mapPropsToValues: () => ({ usernameOrEmail: '', password: '' }),

  handleSubmit(
    values,
    {
      setErrors,
      props: { onSubmit }
    }
  ) {
    onSubmit(values).catch(e => {
      setErrors(e);
    });
  },
  validate: values => validate(values, loginFormSchema),
  displayName: 'LoginForm' // helps with React DevTools
});

export default translate('user')(LoginFormWithFormik(LoginForm));
