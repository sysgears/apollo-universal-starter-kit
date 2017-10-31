import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import SubscriptionView from '../components/SubscriptionView';

import SUBSCRIBE from '../graphql/Subscribe.graphql';
import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';

class Subscription extends React.Component {
  render() {
    return <SubscriptionView {...this.props} />;
  }
}

Subscription.propTypes = {
  subscribe: PropTypes.func.isRequired
};

const SubscriptionViewWithApollo = compose(
  graphql(SUBSCRIBE, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      subscribe: async ({ nameOnCard, cardNumber, cvv }) => {
        try {
          const { data: { subscribe } } = await mutate({
            variables: { input: { nameOnCard, cardNumber, cvv } },
            update: (store, { data: { subscribe } }) => {
              const data = store.readQuery({ query: SUBSCRIPTION_QUERY });
              data.subscription = subscribe;
              store.writeQuery({ query: SUBSCRIPTION_QUERY, data });
            }
          });

          if (subscribe.errors) {
            return { errors: subscribe.errors };
          }

          if (history) {
            return history.push('/subscribers-only');
          }
          if (navigation) {
            return navigation.goBack();
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(Subscription);

export default SubscriptionViewWithApollo;
