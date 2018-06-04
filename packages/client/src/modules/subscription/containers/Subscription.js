import React from 'react';
import { graphql, compose } from 'react-apollo';
import { StripeProvider } from 'react-stripe-elements';

import SubscriptionView from '../components/SubscriptionView';

import SUBSCRIBE from '../graphql/Subscribe.graphql';
import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';
import CARD_INFO from '../graphql/CardInfoQuery.graphql';

import settings from '../../../../../../settings';

// react-stripe-elements will not render on the server.
class Subscription extends React.Component {
  render() {
    return (
      <div>
        {__CLIENT__ ? (
          <StripeProvider apiKey={settings.subscription.stripePublishableKey}>
            <SubscriptionView {...this.props} />
          </StripeProvider>
        ) : (
          <SubscriptionView {...this.props} />
        )}
      </div>
    );
  }
}

const SubscriptionViewWithApollo = compose(
  graphql(SUBSCRIBE, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      subscribe: async ({ token, expiryMonth, expiryYear, last4, brand }) => {
        try {
          const {
            data: { subscribe }
          } = await mutate({
            variables: { input: { token, expiryMonth, expiryYear, last4, brand } },
            update: (store, { data: { subscribe } }) => {
              const data = store.readQuery({ query: SUBSCRIPTION_QUERY });
              data.subscription = subscribe;
              store.writeQuery({ query: SUBSCRIPTION_QUERY, data });
            },
            refetchQueries: [{ query: CARD_INFO }]
          });

          if (subscribe.errors) {
            return { errors: subscribe.errors };
          }

          if (history) {
            history.push('/subscribers-only');
          }
          if (navigation) {
            navigation.goBack();
          }

          return subscribe;
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(Subscription);

export default SubscriptionViewWithApollo;
