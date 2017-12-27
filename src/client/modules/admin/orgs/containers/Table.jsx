/*eslint-disable no-unused-vars*/
import React from 'react';
import { connect } from 'react-redux';

import { graphql, compose } from 'react-apollo';

import OrgsTableView from '../components/TableView';

class OrgsTable extends React.Component {
  render() {
    return <OrgsTableView {...this.props} />;
  }
}

export default OrgsTable;
