import React from 'react';
import { Mutation } from 'react-apollo';

import CancelSubscriptionView from '../components/CancelSubscriptionView';
import translate, { TranslateFunction } from '../../../../../i18n';

import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';
import CREDIT_CARD_QUERY from '../graphql/CreditCardQuery.graphql';
import CANCEL_SUBSCRIPTION from '../graphql/CancelSubscription.graphql';

interface CancelSubscriptionProps {
  t: TranslateFunction;
}

class CancelSubscription extends React.Component<CancelSubscriptionProps, { [key: string]: any }> {
  constructor(props: CancelSubscriptionProps) {
    super(props);
    this.state = {
      submitting: false,
      error: null
    };
  }

  public onClick = (cancelSubscription: any) => async () => {
    this.setState({ submitting: true });

    // Sets state only when there is an error to prevent warning about
    // force update the component after it was unmounted
    try {
      const { data } = await cancelSubscription();
      if (data.cancelStripeSubscription.errors) {
        this.setState({
          submitting: false,
          error: data.cancelStripeSubscription.errors
            ? data.cancelStripeSubscription.errors.map((e: any) => e.message).join('\n')
            : null
        });
      }
    } catch (e) {
      this.setState({ submitting: false, error: this.props.t('serverError') });
    }
  };

  public render() {
    const { t } = this.props;

    return (
      <Mutation
        mutation={CANCEL_SUBSCRIPTION}
        update={(cache, { data: { cancelStripeSubscription } }) => {
          const cachedSubscription: any = cache.readQuery({ query: SUBSCRIPTION_QUERY });
          cachedSubscription.stripeSubscription = cancelStripeSubscription;
          cache.writeQuery({ query: SUBSCRIPTION_QUERY, data: cachedSubscription });
        }}
        refetchQueries={[{ query: CREDIT_CARD_QUERY }]}
      >
        {cancelSubscription => {
          return (
            <CancelSubscriptionView
              submitting={this.state.submitting}
              error={this.state.error}
              onClick={this.onClick(cancelSubscription)}
              t={t}
            />
          );
        }}
      </Mutation>
    );
  }
}

export default translate('stripeSubscription')(CancelSubscription);
