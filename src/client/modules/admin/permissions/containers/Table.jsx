// React
import React from 'react';
// import { connect } from 'react-redux';

// Apollo
// import { graphql, compose } from 'react-apollo';

// Components
import PermissionsTableView from '../components/TableView';

class PermissionsTable extends React.Component {
  render() {
    return <PermissionsTableView {...this.props} />;
  }
}

export default PermissionsTable;
