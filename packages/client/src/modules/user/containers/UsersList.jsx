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

  componentDidMount() {
    this.checkSubscription();
  }

  componentDidUpdate() {
    this.checkSubscription();
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription();
    }
  }

  checkSubscription() {
    const { loading, subscribeToMore, filter } = this.props;

    if (!loading) {
      // The component must re-subscribe every time filters changed.
      // That allows to get valid data after some CRUD operation happens.
      if (this.subscription) {
        this.subscription();
        this.subscription = null;
      }

      this.subscription = subscribeToUsersList(subscribeToMore, filter);
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

export default compose(
  withUsersState,
  withUsers,
  withOrderByUpdating,
  withUsersDeleting
)(UsersList);
