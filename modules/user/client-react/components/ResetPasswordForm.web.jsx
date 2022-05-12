import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import { isFormError, FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { translate } from '@gqlapp/i18n-client-react';
import { required, minLength, validate, match } from '@gqlapp/validation-common-react';
import { Form, RenderField, Button, Alert } from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';

const resetPasswordFormSchema = {
  password: [required, minLength(settings.auth.password.minLength)],
  passwordConfirmation: [match('password'), required, minLength(settings.auth.password.minLength)]
};

const ResetPasswordForm = ({ values, handleSubmit, errors, t }) => (
  <Form name="resetPassword" onSubmit={handleSubmit}>
    <Field
      name="password"
      component={RenderField}
      type="password"
      label={t('resetPass.form.field.pass')}
      value={values.password}
    />
    <Field
      name="passwordConfirmation"
      component={RenderField}
      type="password"
      label={t('resetPass.form.field.passConf')}
      value={values.passwordConfirmation}
    />
    {errors && errors.errorMsg && <Alert color="error">{errors.errorMsg}</Alert>}
    <Button color="primary" type="submit">
      {t('resetPass.form.btnSubmit')}
    </Button>
  </Form>
);

ResetPasswordForm.propTypes = {
  handleSubmit: PropTypes.func,
  values: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  errors: PropTypes.object,
  t: PropTypes.func
};

const ResetPasswordFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ password: '', passwordConfirmation: '' }),
  async handleSubmit(values, { setErrors, resetForm, props: { onSubmit } }) {
    await onSubmit(values)
      .then(() => resetForm())
      .catch(e => {
        if (isFormError(e)) {
          setErrors(e.errors);
        } else {
          throw e;
        }
      });
  },
  validate: values => validate(values, resetPasswordFormSchema),
  displayName: 'LoginForm' // helps with React DevTools
});

export default translate('user')(ResetPasswordFormWithFormik(ResetPasswordForm));
