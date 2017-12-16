/*eslint-disable no-unused-vars*/
import React from 'react';
import { graphql, compose } from 'react-apollo';

import OrgsView from '../components/OrgsView';

class Orgs extends React.Component {
  render() {
    return <OrgsView {...this.props} />;
  }
}

const OrgsWithApollo = compose()(Orgs);

export default OrgsWithApollo;
