/*eslint-disable no-unused-vars*/
import React from 'react';
import { graphql, compose } from 'react-apollo';

import UsersMainView from '../components/MainView';

class UsersMain extends React.Component {
  render() {
    return <UsersMainView {...this.props} />;
  }
}

const UsersMainWithApollo = compose()(UsersMain);

export default UsersMainWithApollo;
