/*eslint-disable no-unused-vars*/
// React
import React from 'react';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import SubscriptionView from '../components/SubscriptionView';

class Subscription extends React.Component {
  render() {
    return <SubscriptionView {...this.props} />;
  }
}

const SubscriptionViewWithApollo = compose()(Subscription);

export default SubscriptionViewWithApollo;
