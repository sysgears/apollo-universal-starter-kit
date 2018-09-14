import React from 'react';
import { Query, Mutation } from 'react-apollo';

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
      cancelling: false,
      errors: null
    };
  }

  public onClick = (cancelSubscription: any) => async () => {
    this.setState({ cancelling: true });
    const { errors } = await cancelSubscription();
    this.setState({ cancelling: false, errors: errors ? errors.map((e: any) => e.message).join('\n') : null });
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
              cancelling={this.state.cancelling}
              errors={this.state.errors}
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
