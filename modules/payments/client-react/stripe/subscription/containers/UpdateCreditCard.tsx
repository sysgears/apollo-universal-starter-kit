import React, { Fragment, useState } from 'react';
import { Mutation } from 'react-apollo';
import { StripeProvider } from 'react-stripe-elements';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { PLATFORM } from '@gqlapp/core-common';
import { FormError } from '@gqlapp/forms-client-react';
import { isApolloError } from 'apollo-client';
import UpdateCreditCardView from '../components/UpdateCreditCardView';

import UPDATE_CREDIT_CARD from '../graphql/UpdateCreditCard.graphql';
import CREDIT_CARD_QUERY from '../graphql/CreditCardQuery.graphql';

import settings from '../../../../../../settings';
import { createCreditCardToken } from './stripeOperations';
import { CreditCardInput } from '../types';

interface UpdateCreditCardProps {
  t: TranslateFunction;
  history: any;
  navigation: any;
}

// react-stripe-elements will not render on the server.
const UpdateCreditCard = ({ t, history, navigation }: UpdateCreditCardProps) => {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (updateCard: any) => async (creditCardInput: CreditCardInput, stripe?: any) => {
    setSubmitting(true);
    let preparedCreditCard;

    try {
      // create credit card token
      preparedCreditCard = await createCreditCardToken(creditCardInput, stripe);

      await updateCard({ variables: { input: preparedCreditCard } });

      setSubmitting(false);
      history ? history.push('/profile') : navigation.navigate('Profile');
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
    <Mutation mutation={UPDATE_CREDIT_CARD} refetchQueries={[{ query: CREDIT_CARD_QUERY }]}>
      {updateCard => {
        return (
          <Fragment>
            {__CLIENT__ && PLATFORM === 'web' ? (
              <StripeProvider apiKey={settings.stripe.subscription.publicKey}>
                <UpdateCreditCardView submitting={submitting} onSubmit={onSubmit(updateCard)} t={t} />
              </StripeProvider>
            ) : (
              <UpdateCreditCardView submitting={submitting} onSubmit={onSubmit(updateCard)} t={t} />
            )}
          </Fragment>
        );
      }}
    </Mutation>
  );
};

export default translate('stripeSubscription')(UpdateCreditCard);
