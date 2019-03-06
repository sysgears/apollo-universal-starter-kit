import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';

import UsersList from '../components/UsersListView';
import UsersFilter from '../components/UsersFilterView';
import withSubscription from './withSubscription';
import {
  updateUsersState,
  withFilterUpdating,
  withOrderByUpdating,
  withUsers,
  withUsersDeleting,
  withUsersState
} from './UserOperations';

class Users extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const { usersUpdated, updateQuery } = this.props;
    if (usersUpdated) {
      updateUsersState(usersUpdated, updateQuery);
    }
  }

  render() {
    const isOpenFilter = !!this.props.navigation.getParam('isOpenFilter');
    return (
      <View style={styles.container}>
        {isOpenFilter && (
          <View style={styles.filterContainer}>
            <UsersFilter {...this.props} />
          </View>
        )}
        <View style={styles.usersListContainer}>
          <UsersList {...this.props} />
        </View>
      </View>
    );
  }
}

Users.propTypes = {
  navigation: PropTypes.object,
  usersUpdated: PropTypes.object,
  updateQuery: PropTypes.func,
  loading: PropTypes.bool
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
  withFilterUpdating,
  withSubscription
)(Users);
