import React from 'react';
import { FormikProps, withFormik } from 'formik';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { TranslateFunction } from '@gqlapp/i18n-client-react';
import { Form, RenderField, Button, Alert, Label } from '@gqlapp/look-client-react';
import { isFormError, FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { required, validate } from '@gqlapp/validation-common-react';

interface SubscriptionCardFormViewProps {
  submitting: boolean;
  buttonName: string;
  handleSubmit?: () => void;
  onSubmit: (subscriptionInput: any, stripe: any) => any;
  values?: {
    name: string;
  };
  stripe?: any;
  t: TranslateFunction;
}

const SubscriptionCardFormView = (props: SubscriptionCardFormViewProps & FormikProps<any>) => {
  const { handleSubmit, submitting, buttonName, errors, values, t } = props;

  return (
    <Form layout="block" name="subscription" onSubmit={handleSubmit}>
      <Field
        name="name"
        component={RenderField}
        type="text"
        label={t('creditCard.name')}
        validate={required}
        value={values.name}
      />
      <Label>{t('creditCard.info')}</Label>
      <CardElement className="form-control" style={{ base: { lineHeight: '30px' } }} />
      {errors && errors.errorMsg && <Alert color="error">{errors.errorMsg}</Alert>}
      <Button color="primary" type="submit" disabled={submitting} style={{ marginTop: 15 }}>
        {buttonName}
      </Button>
    </Form>
  );
};

const SubscriptionFormWithFormik = withFormik<SubscriptionCardFormViewProps, any, any>({
  mapPropsToValues: () => ({ name: '' }),
  handleSubmit({ name }, { setErrors, props }) {
    const { stripe, onSubmit } = props;
    onSubmit({ name }, stripe).catch((e: { [key: string]: any }) => {
      if (isFormError(e)) {
        setErrors(e.errors);
      } else {
        throw e;
      }
    });
  },
  validate: values => validate(values, { name: [required] }),
  displayName: 'StripeSubscriptionForm', // helps with React DevTools,
  enableReinitialize: true
});

export default injectStripe(SubscriptionFormWithFormik(SubscriptionCardFormView));
