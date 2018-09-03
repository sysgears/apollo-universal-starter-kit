import React from 'react';
import { withFormik } from 'formik';
import { CardElement, injectStripe } from 'react-stripe-elements';

import translate, { TranslateFunction } from '../../../../../i18n';
import Field from '../../../../../utils/FieldAdapter';
import { Form, RenderField, Button, Alert, Label } from '../../../../common/components/web';
import { required, validateForm } from '../../../../../../../common/validation';

interface SubscriptionCardFormViewProps {
  submitting: boolean;
  action: string;
  error: string;
  handleSubmit: () => void; // TODO: write types
  onSubmit: (subscriptionInput: any) => void;
  values: any;
  stripe: any;
  t: TranslateFunction;
}

const SubscriptionCardFormView = ({
  handleSubmit,
  submitting,
  action,
  error,
  values,
  t
}: SubscriptionCardFormViewProps) => {
  return (
    <Form layout="block" name="subscription" onSubmit={handleSubmit}>
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
};

const SubscriptionFormWithFormik = withFormik({
  mapPropsToValues: () => ({ name: '' }),
  async handleSubmit({ name }, { props }: { props: SubscriptionCardFormViewProps }) {
    const { stripe, onSubmit } = props;
    const { token, error } = await stripe.createToken({ name });

    if (error) {
      return;
    }

    const {
      id,
      card: { exp_month, exp_year, last4, brand }
    } = token;

    await onSubmit({ token: id, expiryMonth: exp_month, expiryYear: exp_year, last4, brand });
  },
  validate: values => validateForm(values, { name: [required] }),
  displayName: 'StripeSubscriptionForm', // helps with React DevTools,
  enableReinitialize: true
});

export default translate('subscription')(injectStripe(SubscriptionFormWithFormik(SubscriptionCardFormView)));
