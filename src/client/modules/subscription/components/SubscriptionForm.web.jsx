import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Form, RenderField, Button, Alert } from '../../common/components/web';

const required = value => (value ? undefined : 'Required');

const SubscriptionForm = ({ handleSubmit, submitting, onSubmit, error }) => {
  const currentYear = new Date().getFullYear();

  return (
    <Form name="subscription" onSubmit={handleSubmit(onSubmit)}>
      <Field name="nameOnCard" component={RenderField} type="text" label="Name On Card" validate={required} />
      <Field name="cardNumber" component={RenderField} type="text" label="Card Number" validate={required} />
      <Field name="cvv" component={RenderField} type="password" label="CVV" validate={required} />
      <Field name="expiryMonth" component={RenderField} type="select" label="Expiration Month" validate={required}>
        {[...Array(12).keys()].map(i => <option value={i + 1}>{i + 1}</option>)}
      </Field>
      <Field name="expiryYear" component={RenderField} type="select" label="Expiration Year" validate={required}>
        {[...Array(20).keys()].map(i => <option value={i + currentYear}>{i + currentYear}</option>)}
      </Field>
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

export default compose(
  connect(() => ({
    initialValues: {
      expiryMonth: 1,
      expiryYear: new Date().getFullYear()
    }
  })),
  reduxForm({
    form: 'subscription'
  })
)(SubscriptionForm);
