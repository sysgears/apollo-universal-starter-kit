import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { View, StyleSheet } from 'react-native';
import Field from '../../../utils/FieldAdapter';
import { Button } from '../../common/components';
import { RenderField } from '../../common/components/native';
import { required, minLength, validateForm, match } from '../../../../../common/validation';
import translate from '../../../i18n';

const resetPasswordFormSchema = {
  password: [required, minLength(8)],
  passwordConfirmation: [match('password'), required, minLength(8)]
};

const validate = values => validateForm(values, resetPasswordFormSchema);

const ResetPasswordForm = ({ values, handleSubmit, t }) => {
  return (
    <View style={styles.formContainer}>
      <Field
        name="password"
        component={RenderField}
        type="password"
        label={t('resetPass.form.field.pass')}
        value={values.password}
        secureTextEntry={true}
        placeholderTextColor="#8e908c"
      />
      <Field
        name="passwordConfirmation"
        component={RenderField}
        type="password"
        label={t('resetPass.form.field.passConf')}
        value={values.passwordConfirmation}
        secureTextEntry={true}
        placeholderTextColor="#8e908c"
      />
      <View style={styles.submit}>
        <Button onPress={handleSubmit}>{t('resetPass.form.btnSubmit')}</Button>
      </View>
    </View>
  );
};

ResetPasswordForm.propTypes = {
  handleSubmit: PropTypes.func,
  t: PropTypes.func,
  values: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool
};

const ResetPasswordFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ password: '', passwordConfirmation: '' }),
  async handleSubmit(values, { setErrors, resetForm, props: { onSubmit } }) {
    await onSubmit(values)
      .then(() => resetForm())
      .catch(e => setErrors(e));
  },
  validate: values => validate(values),
  displayName: 'LoginForm' // helps with React DevTools
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

export default translate('user')(ResetPasswordFormWithFormik(ResetPasswordForm));
