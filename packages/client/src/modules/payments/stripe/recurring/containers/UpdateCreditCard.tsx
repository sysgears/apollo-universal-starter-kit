import React, { Fragment } from 'react';
import { Mutation } from 'react-apollo';
import { StripeProvider } from 'react-stripe-elements';

import UpdateCreditCardView from '../components/UpdateCreditCardView';

import UPDATE_CREDIT_CARD from '../graphql/UpdateCreditCard.graphql';
import CREDIT_CARD_QUERY from '../graphql/CreditCardQuery.graphql';

import settings from '../../../../../../../../settings';
import translate, { TranslateFunction } from '../../../../../i18n';
import { PLATFORM } from '../../../../../../../common/utils';
import { createCardTokenFromMobile } from './stripeOperations';

interface UpdateCreditCardProps {
  t: TranslateFunction;
  history: any; // TODO: write types
  navigation: any;
}

// react-stripe-elements will not render on the server.
class UpdateCreditCard extends React.Component<UpdateCreditCardProps, any> {
  constructor(props: UpdateCreditCardProps) {
    super(props);
    this.state = {
      submitting: false
    };
  }

  public onSubmit = (updateCard: any) => async (creditCardInput: any, stripe?: any) => {
    this.setState({ submitting: true });
    const { t, history, navigation } = this.props;
    let subscriptionInput: any;
    const { name } = creditCardInput;

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

    const {
      data: { updateStripeSubscriptionCard }
    } = await updateCard({ variables: { input: subscriptionInput } });

    if (!updateStripeSubscriptionCard) {
      return { errors: ['Error updating card.'] };
    }

    this.setState({ submitting: false });

    if (history) {
      history.push('/profile');
    }

    if (navigation) {
      navigation.goBack();
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
                <StripeProvider apiKey={settings.payments.stripe.recurring.publicKey}>
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

export default translate('subscription')(UpdateCreditCard);
