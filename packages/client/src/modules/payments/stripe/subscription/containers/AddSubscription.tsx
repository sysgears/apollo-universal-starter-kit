// TypeScript compiler doesn't see global variables in deeply nested files
// without explicit reference to the declaration file.
/*tslint:disable:no-reference */
/// <reference path="../../../../../../typings/typings.d.ts" />
import React, { Fragment } from 'react';
import { Mutation } from 'react-apollo';
import { StripeProvider } from 'react-stripe-elements';

import settings from '../../../../../../../../settings';
import translate, { TranslateFunction } from '../../../../../i18n';
import { createCreditCardToken } from './stripeOperations';
import { PLATFORM } from '../../../../../../../common/utils';
import { CreditCardInput } from '../types';
import AddSubscriptionView from '../components/AddSubscriptionView';

import ADD_SUBSCRIPTION from '../graphql/AddSubscription.graphql';
import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';
import CREDIT_CARD_QUERY from '../graphql/CreditCardQuery.graphql';

interface AddSubscriptionProps {
  t: TranslateFunction;
  history: any;
  navigation: any;
}

// react-stripe-elements will not render on the server and on the mobile.
class AddSubscription extends React.Component<AddSubscriptionProps, { [key: string]: any }> {
  constructor(props: AddSubscriptionProps) {
    super(props);
    this.state = {
      submitting: false,
      error: null
    };
  }

  public onSubmit = (addSubscription: any) => async (creditCardInput: CreditCardInput, stripe?: any) => {
    const { t, history, navigation } = this.props;
    this.setState({ submitting: true });
    let preparedCreditCard;

    try {
      // create credit card token
      try {
        preparedCreditCard = await createCreditCardToken(creditCardInput, stripe);
        if (preparedCreditCard.error) {
          this.setState({ submitting: false, error: t('stripeError') });
          return;
        }
      } catch (e) {
        this.setState({ submitting: false, error: t('creditCardError') });
        return;
      }

      const { data } = await addSubscription({ variables: { input: preparedCreditCard } });
      const { addStripeSubscription } = data;

      this.setState({
        submitting: false,
        error: addStripeSubscription.errors ? addStripeSubscription.errors.map((e: any) => e.message).join('\n') : null
      });
      history ? history.push('/subscriber-page') : navigation.goBack();
    } catch (e) {
      this.setState({ submitting: false, error: t('serverError') });
    }
  };

  public render() {
    const { t } = this.props;
    const { error, submitting } = this.state;

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
              {/* Stripe elements should render only for web*/}
              {__CLIENT__ && PLATFORM === 'web' ? (
                <StripeProvider apiKey={settings.stripe.subscription.publicKey}>
                  <AddSubscriptionView
                    error={error}
                    submitting={submitting}
                    onSubmit={this.onSubmit(addSubscription)}
                    t={t}
                  />
                </StripeProvider>
              ) : (
                <AddSubscriptionView
                  error={error}
                  submitting={submitting}
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

export default translate('stripeSubscription')(AddSubscription);
