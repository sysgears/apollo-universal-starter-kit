import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { isFormError, FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { translate } from '@gqlapp/i18n-client-react';
import { Form, RenderField, Button, Alert } from '@gqlapp/look-client-react';
import { required, email, validate } from '@gqlapp/validation-common-react';

const forgotPasswordFormSchema = {
  email: [required, email]
};

const ForgotPasswordForm = ({ handleSubmit, errors, sent, values, t }) => {
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
        {errors && errors.errorMsg && <Alert color="error">{errors.errorMsg}</Alert>}
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
  errors: PropTypes.object,
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

export default translate('user')(ForgotPasswordFormWithFormik(ForgotPasswordForm));
