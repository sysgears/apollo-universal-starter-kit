/*eslint-disable no-unused-vars*/
import React from 'react';
import { graphql, compose } from 'react-apollo';

import GroupMembersView from '../components/GroupMembersView';

class GroupMembers extends React.Component {
  render() {
    return <GroupMembersView {...this.props} />;
  }
}

const GroupMembersWithApollo = compose()(GroupMembers);

export default GroupMembersWithApollo;
