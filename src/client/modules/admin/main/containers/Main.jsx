import React from 'react';

import AdminView from '../components/MainView';

class AdminMain extends React.Component {
  render() {
    return <AdminView {...this.props} />;
  }
}

export default AdminMain;
