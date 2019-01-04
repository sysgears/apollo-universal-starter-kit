import React, { Component, Fragment } from 'react';

// import { Query } from 'react-apollo';
// import ReportQuery from '../graphql/ReportQuery.graphql';

import ReportDemo from './ReportDemo.web';

class Reports extends Component {
  render() {
    return (
      <Fragment>
        <ReportDemo />
        {/*<Query query={ReportQuery} variables={{ "id": 1 }}>*/}
        {/*{({ loading, data:{report}})=> {*/}
        {/*if (loading) return null;*/}
        {/*// return <ReportsView  {...this.props} reports={reports} />*/}
        {/*return <ReportsView  {...this.props} report={report} />*/}
        {/*}}*/}
        {/*</Query>*/}
      </Fragment>
    );
  }
}

export default Reports;
