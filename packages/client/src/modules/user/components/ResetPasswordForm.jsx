import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { View, StyleSheet } from 'react-native';
import Field from '../../../utils/FieldAdapter';
import { Button } from '../../common/components';
import { RenderField } from '../../common/components/native';
import { required, minLength, validateForm, match } from '../../../../../common/validation';

const resetPasswordFormSchema = {
  password: [required, minLength(5)],
  passwordConfirmation: [match('password'), required, minLength(5)]
};

const validate = values => validateForm(values, resetPasswordFormSchema);

const ResetPasswordForm = ({ values, handleSubmit }) => {
  return (
    <View style={styles.formContainer}>
      <Field
        name="password"
        component={RenderField}
        type="password"
        label="Password"
        value={values.password}
        secureTextEntry={true}
        placeholderTextColor="#8e908c"
      />
      <Field
        name="passwordConfirmation"
        component={RenderField}
        type="password"
        label="Password Confirmation"
        value={values.passwordConfirmation}
        secureTextEntry={true}
        placeholderTextColor="#8e908c"
      />
      <View style={styles.submit}>
        <Button onPress={handleSubmit}>Reset Password</Button>
      </View>
    </View>
  );
};

ResetPasswordForm.propTypes = {
  handleSubmit: PropTypes.func,
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

export default ResetPasswordFormWithFormik(ResetPasswordForm);
