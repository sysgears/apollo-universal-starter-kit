import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button, Alert } from '../../common/components/web';
import { required, minLength, validateForm, match } from '../../../../../common/validation';

const contactFormSchema = {
  password: [required, minLength(5)],
  passwordConfirmation: [match('password'), required, minLength(5)]
};

const validate = values => validateForm(values, contactFormSchema);

const ResetPasswordForm = ({ handleChange, values, handleSubmit, submitting, onSubmit, error }) => {
  return (
    <Form name="resetPassword" onSubmit={handleSubmit(onSubmit)}>
      <Field
        name="password"
        component={RenderField}
        type="password"
        label="Password"
        onChange={handleChange}
        value={values.password}
      />
      <Field
        name="passwordConfirmation"
        component={RenderField}
        type="password"
        label="Password Confirmation"
        onChange={handleChange}
        value={values.passwordConfirmation}
      />
      {error && <Alert color="error">{error}</Alert>}
      <Button color="primary" type="submit" disabled={submitting}>
        Reset Password
      </Button>
    </Form>
  );
};

ResetPasswordForm.propTypes = {
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  values: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string
};

const ResetPasswordFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ email: '' }),
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    resetForm();
  },
  validate: values => validate(values),
  displayName: 'LoginForm' // helps with React DevTools
});

export default ResetPasswordFormWithFormik(ResetPasswordForm);
