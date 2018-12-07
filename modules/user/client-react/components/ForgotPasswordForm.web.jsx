import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { FieldAdapter as Field } from '@module/core-client-react';
import { translate } from '@module/i18n-client-react';
import { Form, RenderField, Button, Alert } from '@module/look-client-react';
import { required, email, validate } from '@module/validation-common-react';

const forgotPasswordFormSchema = {
  email: [required, email]
};

const ForgotPasswordForm = ({ handleSubmit, error, sent, values, t }) => {
  return (
    <Form name="forgotPassword" onSubmit={handleSubmit}>
      {sent && <Alert color="success">{t('forgotPass.form.submitMsg')}</Alert>}
      <Field
        name="email"
        component={RenderField}
        type="email"
        label={t('forgotPass.form.fldEmail')}
        value={values.email}
      />
      <div className="text-center">
        {error && <Alert color="error">{error}</Alert>}
        <Button color="primary" type="submit">
          {t('forgotPass.form.btnSubmit')}
        </Button>
      </div>
    </Form>
  );
};

ForgotPasswordForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  error: PropTypes.string,
  sent: PropTypes.bool,
  values: PropTypes.object,
  t: PropTypes.func
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
    await onSubmit(values)
      .then(() => resetForm())
      .catch(e => setErrors(e));
  },
  validate: values => validate(values, forgotPasswordFormSchema),
  displayName: 'ForgotPasswordForm' // helps with React DevTools
});

export default translate('user')(ForgotPasswordFormWithFormik(ForgotPasswordForm));
