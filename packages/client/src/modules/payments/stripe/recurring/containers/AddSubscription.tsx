/*tslint:disable:no-reference */
/// <reference path="../../../../../../typings/typings.d.ts" />

import React, { Fragment } from 'react';
import { Mutation } from 'react-apollo';
import { StripeProvider } from 'react-stripe-elements';

import AddSubscriptionView from '../components/AddSubscriptionView';

import ADD_SUBSCRIPTION from '../graphql/AddSubscription.graphql';
import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';
import CREDIT_CARD_QUERY from '../graphql/CreditCardQuery.graphql';

import settings from '../../../../../../../../settings';
import translate, { TranslateFunction } from '../../../../../i18n';
import { createCardTokenFromMobile } from './stripeOperations';
import { PLATFORM } from '../../../../../../../common/utils';

interface AddSubscriptionProps {
  t: TranslateFunction;
  history: any; // TODO: write types
  navigation: any;
}

// react-stripe-elements will not render on the server and on the mobile.
class AddSubscription extends React.Component<AddSubscriptionProps, any> {
  constructor(props: AddSubscriptionProps) {
    super(props);
    this.state = {
      submitting: false
    };
  }

  public onSubmit = (addSubscription: any) => async (creditCardInput: any, stripe?: any) => {
    this.setState({ submitting: true });
    const { t, history, navigation } = this.props;
    let subscriptionInput: any;
    const { name } = creditCardInput;

    // First create Stripe credit card token
    if (stripe) {
      const { token, error } = await stripe.createToken({ name });

      if (error) {
        return; // TODO: ADD error
      }

      const { id, card } = token;
      const { exp_month, exp_year, last4, brand } = card;
      subscriptionInput = { token: id, expiryMonth: exp_month, expiryYear: exp_year, last4, brand };
    } else {
      const { id, card, error } = await createCardTokenFromMobile(creditCardInput);
      if (error) {
        return; // TODO: ADD error
      }

      const { exp_month, exp_year, last4, brand } = card;
      subscriptionInput = { token: id, expiryMonth: exp_month, expiryYear: exp_year, last4, brand };
    }

    const { data } = await addSubscription({ variables: { input: subscriptionInput } });
    const { addStripeSubscription } = data;

    if (addStripeSubscription.errors) {
      const submitError = { _error: t('errorMsg') };
      addStripeSubscription.errors.map((error: { [key: string]: any }) => (submitError[error.field] = error.message));
      throw submitError;
    }

    this.setState({ submitting: false });

    if (history) {
      history.push('/subscribers-only');
    }

    if (navigation) {
      navigation.goBack();
    }
  };

  public render() {
    const { t } = this.props;
    return (
      <Mutation
        mutation={ADD_SUBSCRIPTION}
        update={(cache, { data: { addStripeSubscription } }) => {
          const data: any = cache.readQuery({ query: SUBSCRIPTION_QUERY });
          data.stripeSubscription = addStripeSubscription;
          cache.writeQuery({ query: SUBSCRIPTION_QUERY, data });
        }}
        refetchQueries={[{ query: CREDIT_CARD_QUERY }]}
      >
        {addSubscription => {
          return (
            <Fragment>
              {__CLIENT__ && PLATFORM === 'web' ? (
                <StripeProvider apiKey={settings.payments.stripe.recurring.publicKey}>
                  <AddSubscriptionView
                    submitting={this.state.submitting}
                    onSubmit={this.onSubmit(addSubscription)}
                    t={t}
                  />
                </StripeProvider>
              ) : (
                <AddSubscriptionView
                  submitting={this.state.submitting}
                  onSubmit={this.onSubmit(addSubscription)}
                  t={t}
                />
              )}
            </Fragment>
          );
        }}
      </Mutation>
    );
  }
}

export default translate('subscription')(AddSubscription);
