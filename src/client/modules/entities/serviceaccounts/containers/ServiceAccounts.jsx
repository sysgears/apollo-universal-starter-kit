/*eslint-disable no-unused-vars*/
import React from 'react';
import { graphql, compose } from 'react-apollo';

import ServiceAccountsView from '../components/ServiceAccountsView';

class ServiceAccounts extends React.Component {
  render() {
    return <ServiceAccountsView {...this.props} />;
  }
}

const ServiceAccountsWithApollo = compose()(ServiceAccounts);

export default ServiceAccountsWithApollo;
