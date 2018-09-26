import React, { Fragment } from 'react';
import { Mutation } from 'react-apollo';
import { StripeProvider } from 'react-stripe-elements';

import UpdateCreditCardView from '../components/UpdateCreditCardView';

import UPDATE_CREDIT_CARD from '../graphql/UpdateCreditCard.graphql';
import CREDIT_CARD_QUERY from '../graphql/CreditCardQuery.graphql';

import settings from '../../../../../../../../settings';
import translate, { TranslateFunction } from '../../../../../i18n';
import { PLATFORM } from '../../../../../../../common/utils';
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
      submitting: false,
      error: null
    };
  }

  public onSubmit = (updateCard: any) => async (creditCardInput: CreditCardInput, stripe?: any) => {
    this.setState({ submitting: true });
    const { t, history, navigation } = this.props;
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

      const { data } = await updateCard({ variables: { input: preparedCreditCard } });
      const { updateStripeSubscriptionCard } = data;

      if (!updateStripeSubscriptionCard) {
        this.setState({ submitting: false, error: t('serverError') });
        return;
      }

      this.setState({ submitting: false });
      history ? history.push('/profile') : navigation.navigate('Profile');
    } catch (e) {
      this.setState({ submitting: false, error: t('serverError') });
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
                  <UpdateCreditCardView
                    error={this.state.error}
                    submitting={this.state.submitting}
                    onSubmit={this.onSubmit(updateCard)}
                    t={t}
                  />
                </StripeProvider>
              ) : (
                <UpdateCreditCardView
                  error={this.state.error}
                  submitting={this.state.submitting}
                  onSubmit={this.onSubmit(updateCard)}
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

export default translate('stripeSubscription')(UpdateCreditCard);
