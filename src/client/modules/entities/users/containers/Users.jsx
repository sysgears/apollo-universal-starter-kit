/*eslint-disable no-unused-vars*/
import React from 'react';
import { graphql, compose } from 'react-apollo';

import UsersView from '../components/UsersView';

class Users extends React.Component {
  render() {
    return <UsersView {...this.props} />;
  }
}

const UsersWithApollo = compose()(Users);

export default UsersWithApollo;
