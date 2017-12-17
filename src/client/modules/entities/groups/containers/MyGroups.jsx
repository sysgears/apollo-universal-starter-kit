/*eslint-disable no-unused-vars*/
import React from 'react';
import { graphql, compose } from 'react-apollo';

import MyGroupsView from '../components/MyGroupsView';

class MyGroups extends React.Component {
  render() {
    return <MyGroupsView {...this.props} />;
  }
}

const MyGroupsWithApollo = compose()(MyGroups);

export default MyGroupsWithApollo;
