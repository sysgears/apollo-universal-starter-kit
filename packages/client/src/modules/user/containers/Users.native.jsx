import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import UsersList from '../components/UsersListView';
import UsersFilter from '../components/UsersFilterView';
import {
  withUsersState,
  whitUsers,
  withUsersDeleting,
  withOrderByUpdating,
  withFilterUpdating
} from './UserOperations';

const Users = ({ ...props }) => {
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <UsersFilter {...props} />
      </View>
      <View style={styles.usersListContainer}>
        <UsersList {...props} />
      </View>
    </View>
  );
};

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
  navigation: PropTypes.object
};

export default compose(withUsersState, whitUsers, withUsersDeleting, withOrderByUpdating, withFilterUpdating)(Users);
