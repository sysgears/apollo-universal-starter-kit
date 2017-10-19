import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { Form, RenderField, Button } from '../../common/components';

const required = value => (value ? undefined : 'Required');

export const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;
export const minLength3 = minLength(3);

const validate = values => {
  const errors = {};

  if (values.password !== values.passwordConfirmation) {
    errors.passwordConfirmation = 'Passwords do not match';
  }
  return errors;
};

const renderCheckBox = ({ input, label, type, meta: { touched, error } }) => {
  let color = 'normal';
  if (touched && error) {
    color = 'danger';
  }

  return (
    <FormGroup color={color} check>
      <Label check>
        <Input {...input} placeholder={label} type={type} /> {label}
        {touched && (error && <FormFeedback>{error}</FormFeedback>)}
      </Label>
    </FormGroup>
  );
};

renderCheckBox.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};

const UserForm = ({ handleSubmit, submitting, onSubmit, errors }) => {
  return (
    <Form name="post" onSubmit={handleSubmit(onSubmit)}>
      <Field name="username" component={RenderField} type="text" label="Username" validate={[required, minLength3]} />
      <Field name="email" component={RenderField} type="email" label="Email" validate={required} />
      <Field name="isAdmin" component={renderCheckBox} type="checkbox" label="Is Admin" />
      <Field name="isActive" component={renderCheckBox} type="checkbox" label="Is Active" />
      <Field name="password" component={RenderField} type="password" label="Password" />
      <Field name="passwordConfirmation" component={RenderField} type="password" label="Password Confirmation" />
      {errors && (
        <FormGroup color="danger">
          <FormFeedback>{errors.map(error => <li key={error.field}>{error.message}</li>)}</FormFeedback>
        </FormGroup>
      )}
      <Button color="primary" type="submit" disabled={submitting}>
        Save
      </Button>
    </Form>
  );
};

UserForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  errors: PropTypes.array
};

export default reduxForm({
  form: 'user',
  validate
})(UserForm);
