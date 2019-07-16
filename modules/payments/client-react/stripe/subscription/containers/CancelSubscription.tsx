import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';

import CancelSubscriptionView from '../components/CancelSubscriptionView';

import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';
import CREDIT_CARD_QUERY from '../graphql/CreditCardQuery.graphql';
import CANCEL_SUBSCRIPTION from '../graphql/CancelSubscription.graphql';
import { ApolloCache } from 'apollo-cache';

interface CancelSubscriptionProps {
  t: TranslateFunction;
}

const CancelSubscription = ({ t }: CancelSubscriptionProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const onClick = (cancelSubscription: any) => async () => {
    setSubmitting(true);

    // Sets state only when there is an error to prevent warning about
    // force update the component after it was unmounted
    try {
      await cancelSubscription();
      setSubmitting(false);
    } catch (e) {
      setSubmitting(false);
      setError(t('serverError'));
    }
  };

  return (
    <Mutation
      mutation={CANCEL_SUBSCRIPTION}
      update={(cache: ApolloCache<any>, { data: { cancelStripeSubscription } }: any) => {
        const cachedSubscription: any = cache.readQuery({ query: SUBSCRIPTION_QUERY });
        cachedSubscription.stripeSubscription = cancelStripeSubscription;
        cache.writeQuery({ query: SUBSCRIPTION_QUERY, data: cachedSubscription });
      }}
      refetchQueries={[{ query: CREDIT_CARD_QUERY }]}
    >
      {(cancelSubscription: any) => {
        return (
          <CancelSubscriptionView submitting={submitting} error={error} onClick={onClick(cancelSubscription)} t={t} />
        );
      }}
    </Mutation>
  );
};

export default translate('stripeSubscription')(CancelSubscription);
