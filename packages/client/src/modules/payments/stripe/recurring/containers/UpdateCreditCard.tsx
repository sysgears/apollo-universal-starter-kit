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
      submitting: false
    };
  }

  public onSubmit = (updateCard: any) => async (creditCardInput: CreditCardInput, stripe?: any) => {
    this.setState({ submitting: true });
    const { t, history, navigation } = this.props;
    const preparedCreditCard = await createCreditCardToken(creditCardInput, stripe);
    const { data } = await updateCard({ variables: { input: preparedCreditCard } });
    const { updateStripeSubscriptionCard } = data;

    if (!updateStripeSubscriptionCard) {
      /*tslint:disable:no-console*/
      console.log('Error updating card');
      // return { errors: ['Error updating card.'] };
    }

    this.setState({ submitting: false });
    history ? history.push('/profile') : navigation.goBack();
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
