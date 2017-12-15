import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Form, RenderField, Button, Alert } from '../../common/components/web';
import { required, email, minLength } from '../../../../common/validation';

const validate = values => {
  const errors = {};

  if (values.password && values.passwordConfirmation && values.password !== values.passwordConfirmation) {
    errors.passwordConfirmation = 'Passwords do not match';
  }
  return errors;
};

const RegisterForm = ({ handleSubmit, submitting, onSubmit, error }) => {
  return (
    <Form name="register" onSubmit={handleSubmit(onSubmit)}>
      <Field name="username" component={RenderField} type="text" label="Username" validate={[required, minLength(3)]} />
      <Field name="email" component={RenderField} type="email" label="Email" validate={[required, email]} />
      <Field
        name="password"
        component={RenderField}
        type="password"
        label="Password"
        validate={[required, minLength(5)]}
      />
      <Field
        name="passwordConfirmation"
        component={RenderField}
        type="password"
        label="Password Confirmation"
        validate={[required, minLength(5)]}
      />
      <div className="text-center">
        {error && <Alert color="error">{error}</Alert>}
        <Button color="primary" type="submit" disabled={submitting}>
          Register
        </Button>
      </div>
    </Form>
  );
};

RegisterForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string
};

export default reduxForm({
  form: 'register',
  validate
})(RegisterForm);
