import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Form, FormGroup, Label, Input, FormFeedback, Button, Alert } from 'reactstrap';

const required = value => (value ? undefined : 'Required');

const renderField = ({ input, label, type, meta: { touched, error } }) => {
  let color = 'normal';
  if (touched && error) {
    color = 'danger';
  }

  return (
    <FormGroup color={color}>
      <Label>{label}</Label>
      <div>
        <Input {...input} placeholder={label} type={type} />
        {touched && (error && <FormFeedback>{error}</FormFeedback>)}
      </div>
    </FormGroup>
  );
};

renderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};

const ResetPasswordForm = ({ handleSubmit, submitting, onSubmit, errors, sent }) => {
  return (
    <Form name="resetPassword" onSubmit={handleSubmit(onSubmit)}>
      {sent && <Alert color="success">Reset password instructions have been emailed to you.</Alert>}
      <Field name="email" component={renderField} type="email" label="Email" validate={required} />
      {errors && (
        <FormGroup color="danger">
          <FormFeedback>{errors.map(error => <li key={error.field}>{error.message}</li>)}</FormFeedback>
        </FormGroup>
      )}
      <Button color="primary" type="submit" disabled={submitting}>
        Reset Password
      </Button>
    </Form>
  );
};

ResetPasswordForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  errors: PropTypes.array,
  sent: PropTypes.bool
};

export default reduxForm({
  form: 'resetPassword'
})(ResetPasswordForm);
