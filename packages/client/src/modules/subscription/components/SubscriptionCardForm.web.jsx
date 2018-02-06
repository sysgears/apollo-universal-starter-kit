import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { CardElement, injectStripe } from 'react-stripe-elements';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button, Alert, Label } from '../../common/components/web';
import { required, validateForm } from '../../../../../common/validation';

const commentFormSchema = {
  name: [required]
};

const validate = values => validateForm(values, commentFormSchema);

class SubscriptionCardForm extends React.Component {
  static propTypes = {
    submitting: PropTypes.bool,
    action: PropTypes.string.isRequired,
    error: PropTypes.string,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func,
    values: PropTypes.object,
    handleChange: PropTypes.func
  };

  render() {
    const { handleSubmit, submitting, action, error, values, handleChange } = this.props;
    return (
      <Form name="subscription" onSubmit={handleSubmit}>
        <Field
          name="name"
          component={RenderField}
          type="text"
          label="Name On Card"
          validate={required}
          onChange={handleChange}
          value={values.name}
        />
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

const SubscriptionFormWithFormik = withFormik({
  mapPropsToValues: () => ({ name: '' }),
  async handleSubmit(values, { resetForm, props }) {
    const onSubmit = async ({ name }) => {
      const { stripe } = props;
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
    await onSubmit(values);
    resetForm({ name: '' });
  },
  validate: values => validate(values),
  displayName: 'SubscriptionForm', // helps with React DevTools,
  enableReinitialize: true
});

export default injectStripe(SubscriptionFormWithFormik(SubscriptionCardForm));
