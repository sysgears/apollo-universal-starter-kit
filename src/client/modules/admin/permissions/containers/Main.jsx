import React from 'react';
import { compose } from 'react-apollo';

import PermissionsMainView from '../components/MainView';

class PermissionsMain extends React.Component {
  render() {
    return <PermissionsMainView {...this.props} />;
  }
}

const PermissionsMainWithApollo = compose()(PermissionsMain);

export default PermissionsMainWithApollo;
