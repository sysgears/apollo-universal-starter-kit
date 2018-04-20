// React
import React from 'react';
import { compose } from 'react-apollo';

// Components
import UsersListView from '../components/UsersListView';

import { withUsersState, whitUsers, withUsersDeleting, withOrderByUpdating } from './UserOperations';

class UsersList extends React.Component {
  render() {
    return <UsersListView {...this.props} />;
  }
}

export default compose(withUsersState, whitUsers, withOrderByUpdating, withUsersDeleting)(UsersList);
