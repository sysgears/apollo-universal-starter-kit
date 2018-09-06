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
import { PLATFORM } from '../../../../../../../common/utils';

interface AddSubscriptionProps {
  t: TranslateFunction;
  history: any; // TODO: write types
  navigation: any;
}

// react-stripe-elements will not render on the server and on the mobile.
const AddSubscription = ({ t, history, navigation }: AddSubscriptionProps) => {
  const onSubmit = (addSubscription: any) => async (subscriptionInput: any) => {
    const {
      data: { addStripeSubscription }
    } = await addSubscription({ variables: { input: subscriptionInput } });

    if (addStripeSubscription.errors) {
      const submitError = { _error: t('errorMsg') };
      addStripeSubscription.errors.map(
        (error: { [key: string]: string }) => (submitError[error.field] = error.message)
      );
      throw submitError;
    }

    if (history) {
      history.push('/subscribers-only');
    }

    if (navigation) {
      navigation.goBack();
    }
  };

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
                <AddSubscriptionView onSubmit={onSubmit(addSubscription)} t={t} />
              </StripeProvider>
            ) : (
              <AddSubscriptionView onSubmit={onSubmit(addSubscription)} t={t} />
            )}
          </Fragment>
        );
      }}
    </Mutation>
  );
};

export default translate('subscription')(AddSubscription);
