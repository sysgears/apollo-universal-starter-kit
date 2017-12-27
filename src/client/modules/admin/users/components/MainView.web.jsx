import React from 'react';

import UserActions from '../containers/Actions';
import UserTable from '../containers/Table';

class UsersMainView extends React.Component {
  render() {
    return (
      <div>
        <UserActions />
        <UserTable />
      </div>
    );
  }
}

export default UsersMainView;
