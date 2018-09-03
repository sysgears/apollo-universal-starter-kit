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
      <Query query={SUBSCRIPTION_QUERY} skip={__SERVER__} fetchPolicy="network-only">
        {({ loading, data }) => (
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
                  loading={__SERVER__ ? true : loading}
                  cancelling={this.state.cancelling}
                  errors={this.state.errors}
                  active={!!(data.stripeSubscription && data.stripeSubscription.active)}
                  onClick={this.onClick(cancelSubscription)}
                  t={t}
                />
              );
            }}
          </Mutation>
        )}
      </Query>
    );
  }
}

// const CancelSubscriptionWithApollo = compose(
//   graphql(SUBSCRIPTION_QUERY, {
//     // i'm not sure why but this query causes SSR to hang. it seems to have
//     // to do with the fact that this query exists in other places in the tree.
//     // possibly having to do with the query name, as if you duplicate the query
//     // file and change the query name to `SubscriptionDataTwo`, then it works.
//     // skipping for now on server.
//     skip: __SERVER__,
//     options: { fetchPolicy: 'network-only' },
//     props({ data: { loading, stripeSubscription } }) {
//       return {
//         loading,
//         active: stripeSubscription && stripeSubscription.active
//       };
//     }
//   }),
//   graphql(CANCEL_SUBSCRIPTION, {
//     props: ({ mutate }) => ({
//       cancel: async () => {
//         try {
//           const {
//             data: { cancelStripeSubscription }
//           } = await mutate({
//             update: (store, { data: { cancelStripeSubscription } }) => {
//               const data = store.readQuery({ query: SUBSCRIPTION_QUERY });
//               data.stripeSubscription = cancelStripeSubscription;
//               store.writeQuery({ query: SUBSCRIPTION_QUERY, data });
//             },
//             refetchQueries: [{ query: CREDIT_CARD_QUERY }]
//           });
//
//           if (cancelStripeSubscription.errors) {
//             return { errors: cancelStripeSubscription.errors.map(e => e.message).join('\n') };
//           }
//
//           return true;
//         } catch (e) {
//           console.log(e.graphQLErrors);
//         }
//       }
//     })
//   }),
//   translate('subscription')
// )(CancelSubscription);

export default translate('subscription')(CancelSubscription);
