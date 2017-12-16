/*eslint-disable no-unused-vars*/
import React from 'react';
import { graphql, compose } from 'react-apollo';

import GroupsView from '../components/GroupsView';

class Groups extends React.Component {
  render() {
    return <GroupsView {...this.props} />;
  }
}

const GroupsWithApollo = compose()(Groups);

export default GroupsWithApollo;
