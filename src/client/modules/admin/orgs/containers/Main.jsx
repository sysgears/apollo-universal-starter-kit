/*eslint-disable no-unused-vars*/
import React from 'react';
import { graphql, compose } from 'react-apollo';

import OrgsMainView from '../components/MainView';

class OrgsMain extends React.Component {
  render() {
    return <OrgsMainView {...this.props} />;
  }
}

const OrgsMainWithApollo = compose()(OrgsMain);

export default OrgsMainWithApollo;
