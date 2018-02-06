import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button, Alert } from '../../common/components/web';
import { required, email, validateForm } from '../../../../../common/validation';

const contactFormSchema = {
  email: [required, email]
};

const validate = values => validateForm(values, contactFormSchema);

const ForgotPasswordForm = ({ handleSubmit, error, sent, handleChange, values }) => {
  return (
    <Form name="forgotPassword" onSubmit={handleSubmit}>
      {sent && <Alert color="success">Reset password instructions have been emailed to you.</Alert>}
      <Field
        name="email"
        component={RenderField}
        type="email"
        label="Email"
        onChange={handleChange}
        value={values.email}
      />
      <div className="text-center">
        {error && <Alert color="error">{error}</Alert>}
        <Button color="primary" type="submit">
          Send Reset Instructions
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
  handleChange: PropTypes.func,
  values: PropTypes.object
};

const ForgotPasswordFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ email: '' }),
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    resetForm();
  },
  validate: values => validate(values),
  displayName: 'LoginForm' // helps with React DevTools
});

export default ForgotPasswordFormWithFormik(ForgotPasswordForm);
