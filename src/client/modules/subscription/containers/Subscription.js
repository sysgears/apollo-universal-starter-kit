import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import SubscriptionView from '../components/SubscriptionView';

import SUBSCRIBE from '../graphql/Subscribe.graphql';

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
    props: ({ mutate }) => ({
      subscribe: async ({ nameOnCard, cardNumber, cvv }) => {
        try {
          const { data: { subscribe } } = await mutate({
            variables: { input: { nameOnCard, cardNumber, cvv } }
          });

          if (subscribe.errors) {
            return { errors: subscribe.errors };
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
