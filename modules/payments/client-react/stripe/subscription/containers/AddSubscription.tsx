import { isApolloError } from 'apollo-client';
import React, { Fragment, useState } from 'react';
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
import { ApolloCache } from 'apollo-cache';

interface AddSubscriptionProps {
  t: TranslateFunction;
  history: any;
  navigation: any;
}

// react-stripe-elements will not render on the server and on the mobile.
const AddSubscription = ({ t, history, navigation }: AddSubscriptionProps) => {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (addSubscription: any) => async (creditCardInput: CreditCardInput, stripe?: any) => {
    setSubmitting(true);
    let preparedCreditCard;

    try {
      // create credit card token
      preparedCreditCard = await createCreditCardToken(creditCardInput, stripe);

      await addSubscription({ variables: { input: preparedCreditCard } });

      setSubmitting(false);
      history ? history.push('/subscriber-page') : navigation.goBack();
    } catch (e) {
      setSubmitting(false);
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

  return (
    <Mutation
      mutation={ADD_SUBSCRIPTION}
      update={(cache: ApolloCache<any>, { data: { addStripeSubscription } }: any) => {
        const data: any = cache.readQuery({ query: SUBSCRIPTION_QUERY });
        data.stripeSubscription = addStripeSubscription;
        cache.writeQuery({ query: SUBSCRIPTION_QUERY, data });
      }}
      refetchQueries={[{ query: CREDIT_CARD_QUERY }]}
    >
      {(addSubscription: any) => {
        return (
          <Fragment>
            {/* Stripe elements should render only for web*/}
            {__CLIENT__ && PLATFORM === 'web' ? (
              <StripeProvider apiKey={settings.stripe.subscription.publicKey}>
                <AddSubscriptionView submitting={submitting} onSubmit={onSubmit(addSubscription)} t={t} />
              </StripeProvider>
            ) : (
              <AddSubscriptionView submitting={submitting} onSubmit={onSubmit(addSubscription)} t={t} />
            )}
          </Fragment>
        );
      }}
    </Mutation>
  );
};

export default translate('stripeSubscription')(AddSubscription);
