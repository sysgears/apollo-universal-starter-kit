import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { CardElement, injectStripe } from 'react-stripe-elements';

import translate from '../../../i18n';
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
    t: PropTypes.func
  };

  render() {
    const { handleSubmit, submitting, action, error, values, t } = this.props;
    return (
      <Form name="subscription" onSubmit={handleSubmit}>
        <Field
          name="name"
          component={RenderField}
          type="text"
          label={t('card.name')}
          validate={required}
          value={values.name}
        />
        <Label>{t('card.info')}</Label>
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
  async handleSubmit(values, { props }) {
    const onSubmitForm = async ({ name }) => {
      const { stripe, onSubmit } = props;
      const { token, error } = await stripe.createToken({ name });

      if (error) return;

      const {
        id,
        card: { exp_month, exp_year, last4, brand }
      } = token;

      await onSubmit({
        token: id,
        expiryMonth: exp_month,
        expiryYear: exp_year,
        last4,
        brand
      });
    };
    await onSubmitForm(values);
  },
  validate: values => validate(values),
  displayName: 'SubscriptionForm', // helps with React DevTools,
  enableReinitialize: true
});

export default translate('subscription')(injectStripe(SubscriptionFormWithFormik(SubscriptionCardForm)));
