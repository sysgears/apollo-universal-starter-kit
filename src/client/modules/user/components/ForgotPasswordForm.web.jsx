import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Form, RenderField, Button, Alert } from '../../common/components/web';

const required = value => (value ? undefined : 'Required');

const ForgotPasswordForm = ({ handleSubmit, submitting, onSubmit, error, sent }) => {
  return (
    <Form name="forgotPassword" onSubmit={handleSubmit(onSubmit)}>
      {sent && <Alert color="success">Reset password instructions have been emailed to you.</Alert>}
      <Field name="email" component={RenderField} type="email" label="Email" validate={required} />
      <div className="text-center">
        {error && <Alert color="error">{error}</Alert>}
        <Button color="primary" type="submit" disabled={submitting}>
          Send Reset Instructions
        </Button>
      </div>
    </Form>
  );
};

ForgotPasswordForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  sent: PropTypes.bool
};

export default reduxForm({
  form: 'forgotPassword'
})(ForgotPasswordForm);
