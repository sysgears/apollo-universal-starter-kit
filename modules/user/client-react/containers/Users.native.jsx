import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';

import UsersList from '../components/UsersListView';
import UsersFilter from '../components/UsersFilterView';

import useUsersWithSubscription from './withSubscription';

import {
  updateUsersState,
  withFilterUpdating,
  withOrderByUpdating,
  withUsers,
  withUsersDeleting,
  withUsersState
} from './UserOperations';

const Users = props => {
  const { updateQuery, subscribeToMore, filter } = props;
  const usersUpdated = useUsersWithSubscription(subscribeToMore, filter);

  useEffect(() => {
    if (usersUpdated) {
      updateUsersState(usersUpdated, updateQuery);
    }
  });

  const isOpenFilter = !!props.navigation.getParam('isOpenFilter');
  return (
    <View style={styles.container}>
      {isOpenFilter && (
        <View style={styles.filterContainer}>
          <UsersFilter {...props} />
        </View>
      )}
      <View style={styles.usersListContainer}>
        <UsersList {...props} />
      </View>
    </View>
  );
};

Users.propTypes = {
  navigation: PropTypes.object,
  updateQuery: PropTypes.func,
  subscribeToMore: PropTypes.func,
  filter: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  filterContainer: {
    flex: 5,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    marginBottom: 15,
    justifyContent: 'center'
  },
  usersListContainer: {
    flex: 8,
    marginTop: 15
  }
});

export default compose(
  withUsersState,
  withUsers,
  withUsersDeleting,
  withOrderByUpdating,
  withFilterUpdating
)(Users);
