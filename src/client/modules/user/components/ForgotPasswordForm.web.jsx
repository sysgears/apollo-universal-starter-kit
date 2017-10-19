import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Alert } from 'reactstrap';
import { Form, RenderField, RenderErrors, Button } from '../../common/components';

const required = value => (value ? undefined : 'Required');

const ForgotPasswordForm = ({ handleSubmit, submitting, onSubmit, errors, sent }) => {
  return (
    <Form name="forgotPassword" onSubmit={handleSubmit(onSubmit)}>
      {sent && <Alert color="success">Reset password instructions have been emailed to you.</Alert>}
      <Field name="email" component={RenderField} type="email" label="Email" validate={required} />
      <RenderErrors errors={errors} />
      <Button color="primary" type="submit" disabled={submitting}>
        Send Reset Instructions
      </Button>
    </Form>
  );
};

ForgotPasswordForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  errors: PropTypes.array,
  sent: PropTypes.bool
};

export default reduxForm({
  form: 'forgotPassword'
})(ForgotPasswordForm);
