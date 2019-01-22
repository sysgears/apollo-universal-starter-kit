import React, { Fragment } from 'react';
import { Mutation } from 'react-apollo';
import { StripeProvider } from 'react-stripe-elements';
import { translate, TranslateFunction } from '@module/i18n-client-react';
import { PLATFORM } from '@module/core-common';
import { FormErrors } from '@module/forms-client-react';
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
      if (e && e.type === 'validation_error') {
        throw new FormErrors(t('creditCardError'));
      }
      if (e && e.graphQLErrors[0].message.indexOf('No such customer') !== -1) {
        throw new FormErrors(t('stripeError'), e);
      }
      throw new FormErrors(t('serverError'), e);
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
