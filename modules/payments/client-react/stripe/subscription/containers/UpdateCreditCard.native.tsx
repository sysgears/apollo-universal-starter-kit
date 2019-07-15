import React, { Fragment } from 'react';
import { Mutation } from 'react-apollo';
import { isApolloError } from 'apollo-client';
import { StripeProvider } from 'react-stripe-elements';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { PLATFORM } from '@gqlapp/core-common';
import { FormError } from '@gqlapp/forms-client-react';
import settings from '@gqlapp/config';

import UPDATE_CREDIT_CARD from '../graphql/UpdateCreditCard.graphql';
import CREDIT_CARD_QUERY from '../graphql/CreditCardQuery.graphql';

import UpdateCreditCardView from '../components/UpdateCreditCardView';
import { createCreditCardToken } from './stripeOperations';
import { CreditCardInput } from '../types';

interface UpdateCreditCardProps {
  t: TranslateFunction;
  history: any;
  navigation: any;
}

// react-stripe-elements will not render on the server.
class UpdateCreditCard extends React.Component<UpdateCreditCardProps, { [key: string]: any }> {
  constructor(props: UpdateCreditCardProps) {
    super(props);
    this.state = {
      submitting: false
    };
  }

  public onSubmit = (updateCard: any) => async (creditCardInput: CreditCardInput, stripe?: any) => {
    this.setState({ submitting: true });
    const { t, history, navigation } = this.props;
    let preparedCreditCard;

    try {
      // create credit card token
      preparedCreditCard = await createCreditCardToken(creditCardInput, stripe);

      await updateCard({ variables: { input: preparedCreditCard } });

      this.setState({ submitting: false });
      history ? history.push('/profile') : navigation.navigate('Profile');
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
    return (
      <Mutation mutation={UPDATE_CREDIT_CARD} refetchQueries={[{ query: CREDIT_CARD_QUERY }]}>
        {updateCard => {
          return (
            <Fragment>
              {__CLIENT__ && PLATFORM === 'web' ? (
                <StripeProvider apiKey={settings.stripe.subscription.publicKey}>
                  <UpdateCreditCardView submitting={this.state.submitting} onSubmit={this.onSubmit(updateCard)} t={t} />
                </StripeProvider>
              ) : (
                <UpdateCreditCardView submitting={this.state.submitting} onSubmit={this.onSubmit(updateCard)} t={t} />
              )}
            </Fragment>
          );
        }}
      </Mutation>
    );
  }
}

export default translate('stripeSubscription')(UpdateCreditCard);
