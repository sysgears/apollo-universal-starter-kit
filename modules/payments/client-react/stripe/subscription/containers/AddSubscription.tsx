import React, { Fragment } from 'react';
import { Mutation } from 'react-apollo';
import { StripeProvider } from 'react-stripe-elements';
import { translate, TranslateFunction } from '@module/i18n-client-react';
import { PLATFORM } from '@module/core-common';
import { FormErrors } from '@module/forms-client-react';
import settings from '../../../../../../settings';
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
