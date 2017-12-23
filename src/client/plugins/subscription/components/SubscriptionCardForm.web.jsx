import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { Form, RenderField, Button, Alert, Label } from '../../common/components/web';

import { required } from '../../../../common/validation';

class SubscriptionCardForm extends React.Component {
  static propTypes = {
    submitting: PropTypes.bool,
    action: PropTypes.string.isRequired,
    error: PropTypes.string,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func
  };

  onSubmit = async ({ name }) => {
    const { stripe } = this.props;
    const { token, error } = await stripe.createToken({ name });
    if (error) return;

    const { id, card: { exp_month, exp_year, last4, brand } } = token;

    await this.props.onSubmit({
      token: id,
      expiryMonth: exp_month,
      expiryYear: exp_year,
      last4,
      brand
    });
  };

  render() {
    const { handleSubmit, submitting, action, error } = this.props;
    return (
      <Form name="subscription" onSubmit={handleSubmit(this.onSubmit)}>
        <Field name="name" component={RenderField} type="text" label="Name On Card" validate={required} />
        <Label>Payment Info</Label>
        <CardElement className="form-control" style={{ base: { lineHeight: '30px' } }} />
        {error && <Alert color="error">{error}</Alert>}
        <Button color="primary" type="submit" disabled={submitting} style={{ marginTop: 15 }}>
          {action}
        </Button>
      </Form>
    );
  }
}

export default injectStripe(
  reduxForm({
    form: 'subscription'
  })(SubscriptionCardForm)
);
