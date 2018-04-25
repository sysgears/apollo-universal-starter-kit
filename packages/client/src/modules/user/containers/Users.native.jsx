import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import UsersList from '../components/UsersListView';
import UsersFilter from '../components/UsersFilterView';
import {
  withUsersState,
  withUsers,
  withUsersDeleting,
  withOrderByUpdating,
  withFilterUpdating,
  subscribeToUsersList
} from './UserOperations';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    const { subscribeToMore, filter } = this.props;
    if (!nextProps.loading) {
      if (this.subscription) {
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
    return (
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <UsersFilter {...this.props} />
        </View>
        <View style={styles.usersListContainer}>
          <UsersList {...this.props} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  filterContainer: {
    flex: 4,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    marginBottom: 15,
    justifyContent: 'center'
  },
  usersListContainer: {
    flex: 8
  }
});

Users.propTypes = {
  filter: PropTypes.object,
  subscribeToMore: PropTypes.func,
  loading: PropTypes.bool
};

export default compose(withUsersState, withUsers, withUsersDeleting, withOrderByUpdating, withFilterUpdating)(Users);
