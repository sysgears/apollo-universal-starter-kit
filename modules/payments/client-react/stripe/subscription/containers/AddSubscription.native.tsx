import { isApolloError } from 'apollo-client';
import React, { Fragment } from 'react';
import { Mutation } from 'react-apollo';
import { StripeProvider } from 'react-stripe-elements';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { PLATFORM } from '@gqlapp/core-common';
import { FormError } from '@gqlapp/forms-client-react';
import settings from '@gqlapp/config';

import { createCreditCardToken } from './stripeOperations';
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
      submitting: false
    };
  }

  public onSubmit = (addSubscription: any) => async (creditCardInput: CreditCardInput, stripe?: any) => {
    const { t, history, navigation } = this.props;
    this.setState({ submitting: true });
    let preparedCreditCard;

    try {
      // create credit card token
      preparedCreditCard = await createCreditCardToken(creditCardInput, stripe);

      await addSubscription({ variables: { input: preparedCreditCard } });

      this.setState({
        submitting: false
      });
      history ? history.push('/subscriber-page') : navigation.goBack();
    } catch (e) {
      this.setState({
        submitting: false
      });
      if (isApolloError(e)) {
        if (e.graphQLErrors[0].extensions.code === 'resource_missing') {
          throw new FormError(t('stripeError'), e);
        } else {
          throw new FormError(t('serverError'), e);
        }
      } else {
        throw new FormError(t('creditCardError'));
      }
    }
  };

  public render() {
    const { t } = this.props;
    const { submitting } = this.state;

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
                  <AddSubscriptionView submitting={submitting} onSubmit={this.onSubmit(addSubscription)} t={t} />
                </StripeProvider>
              ) : (
                <AddSubscriptionView submitting={submitting} onSubmit={this.onSubmit(addSubscription)} t={t} />
              )}
            </Fragment>
          );
        }}
      </Mutation>
    );
  }
}

export default translate('stripeSubscription')(AddSubscription);
