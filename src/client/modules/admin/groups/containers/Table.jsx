/*eslint-disable no-unused-vars*/
import React from 'react';
import { connect } from 'react-redux';

import { graphql, compose } from 'react-apollo';

import GroupsTableView from '../components/TableView';

class GroupsTable extends React.Component {
  render() {
    return <GroupsTableView {...this.props} />;
  }
}

export default GroupsTable;
