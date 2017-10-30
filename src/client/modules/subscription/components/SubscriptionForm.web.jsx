import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Form, RenderField, Button, Alert } from '../../common/components/web';

const required = value => (value ? undefined : 'Required');

const SubscriptionForm = ({ handleSubmit, submitting, onSubmit, error }) => {
  return (
    <Form name="subscription" onSubmit={handleSubmit(onSubmit)}>
      <Field name="nameOnCard" component={RenderField} type="text" label="Name On Card" validate={required} />
      <Field name="cardNumber" component={RenderField} type="text" label="Card Number" validate={required} />
      <Field name="cvv" component={RenderField} type="password" label="CVV" validate={required} />
      {error && <Alert color="error">{error}</Alert>}
      <Button color="primary" type="submit" disabled={submitting}>
        Subscribe
      </Button>
    </Form>
  );
};

SubscriptionForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string
};

export default reduxForm({
  form: 'subscription'
})(SubscriptionForm);
