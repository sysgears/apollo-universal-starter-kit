import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { FontAwesome } from '@expo/vector-icons';
import { View, StyleSheet, Text, Keyboard } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { isFormError, FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { RenderField, Button, primary, lookStyles } from '@gqlapp/look-client-react-native';
import { required, email, validate } from '@gqlapp/validation-common-react';
import { translate } from '@gqlapp/i18n-client-react';

const forgotPasswordFormSchema = {
  email: [required, email]
};

const ForgotPasswordForm = ({ handleSubmit, values, sent, t }) => {
  return (
    <View style={styles.formContainer}>
      <View style={styles.alertContainer}>
        {sent && (
          <View style={styles.alertWrapper}>
            <View style={styles.alertIconWrapper}>
              <FontAwesome name="check-circle" size={30} style={{ color: '#155724' }} />
            </View>
            <View style={styles.alertTextWrapper}>
              <Text style={styles.alertText}>{t('forgotPass.form.submitMsg')}</Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.form}>
        <View>
          <Field
            name="email"
            component={RenderField}
            type="email"
            placeholder={t('forgotPass.form.fldEmail')}
            value={values.email}
            keyboardType="email-address"
            placeholderTextColor={lookStyles.placeholderColor}
          />
        </View>
        <View style={styles.submit}>
          <Button type={primary} onPress={() => handleSubmit(values)}>
            {t('forgotPass.form.btnSubmit')}
          </Button>
        </View>
      </View>
      <KeyboardSpacer />
    </View>
  );
};

ForgotPasswordForm.propTypes = {
  handleSubmit: PropTypes.func,
  t: PropTypes.func,
  values: PropTypes.object,
  sent: PropTypes.bool
};

const ForgotPasswordFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ email: '' }),
  async handleSubmit(
    values,
    {
      setErrors,
      resetForm,
      props: { onSubmit }
    }
  ) {
    Keyboard.dismiss();
    await onSubmit(values)
      .then(() => {
        resetForm();
      })
      .catch(e => {
        if (isFormError(e)) {
          setErrors(e.errors);
        } else {
          throw e;
        }
      });
  },
  validate: values => validate(values, forgotPasswordFormSchema),
  displayName: 'ForgotPasswordForm' // helps with React DevTools
});

const styles = StyleSheet.create({
  submit: lookStyles.submit,
  formContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  form: {
    flex: 2
  },
  alertWrapper: {
    backgroundColor: '#d4edda',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 5,
    paddingVertical: 10
  },
  alertContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  alertTextWrapper: {
    padding: 5,
    flex: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertIconWrapper: {
    padding: 5,
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertText: {
    color: '#155724',
    fontSize: 20,
    fontWeight: '400'
  }
});

export default translate('user')(ForgotPasswordFormWithFormik(ForgotPasswordForm));
