import React from 'react';
import PropTypes from 'prop-types';
import { CardElement, injectStripe } from 'react-stripe-elements';
//eslint-disable-next-line import/no-extraneous-dependencies
import DomainSchema from '@domain-schema/core';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik, FormSchema } from '@domain-schema/formik';

import translate from '../../../i18n';
import { Label } from '../../common/components/web';

const subscriptionFormSchema = ({ t, submitting, action }) =>
  new DomainSchema(
    class extends FormSchema {
      __ = { name: 'PostForm' };
      name = {
        type: String,
        fieldType: DomainSchemaFormik.fields.input,
        input: {
          label: t('card.name')
        }
      };
      setSubmitBtn() {
        return {
          label: action,
          color: 'primary',
          disabled: submitting
        };
      }
    }
  );

class SubscriptionCardForm extends React.Component {
  static propTypes = {
    submitting: PropTypes.bool,
    action: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
    t: PropTypes.func,
    stripe: PropTypes.object
  };

  render() {
    const { onSubmit, ...props } = this.props;

    const subscriptionForm = new DomainSchemaFormik(subscriptionFormSchema(props));
    const SubscriptionFormComponent = subscriptionForm.generateForm();

    return (
      <React.Fragment>
        <Label>{props.t('card.info')}</Label>
        <CardElement className="form-control" style={{ base: { lineHeight: '30px' } }} />
        <SubscriptionFormComponent
          onSubmit={async ({ name }, { setErrors }) => {
            const { stripe } = props;
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
            }).catch(e => setErrors(e));
          }}
        />
      </React.Fragment>
    );
  }
}

export default translate('subscription')(injectStripe(SubscriptionCardForm));
