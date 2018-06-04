// React
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';

// Components
import UsersListView from '../components/UsersListView';

import {
  withUsersState,
  withUsers,
  withUsersDeleting,
  withOrderByUpdating,
  subscribeToUsersList
} from './UserOperations';

class UsersList extends React.Component {
  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    const { subscribeToMore, filter, users } = this.props;
    if (!nextProps.loading) {
      if (this.subscription && nextProps.users.length !== users.length) {
        this.subscription();
        this.subscription = null;
      }

      if (!this.subscription) {
        this.subscription = subscribeToUsersList(subscribeToMore, filter);
      }
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription();
    }
  }

  render() {
    return <UsersListView {...this.props} />;
  }
}

UsersList.propTypes = {
  filter: PropTypes.object,
  users: PropTypes.array,
  subscribeToMore: PropTypes.func,
  loading: PropTypes.bool
};

export default compose(withUsersState, withUsers, withOrderByUpdating, withUsersDeleting)(UsersList);
