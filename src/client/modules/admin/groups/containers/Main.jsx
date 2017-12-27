/*eslint-disable no-unused-vars*/
import React from 'react';
import { graphql, compose } from 'react-apollo';

import GroupsMainView from '../components/MainView';

class GroupsMain extends React.Component {
  render() {
    return <GroupsMainView {...this.props} />;
  }
}

const GroupsMainWithApollo = compose()(GroupsMain);

export default GroupsMainWithApollo;
