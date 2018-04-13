import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import UsersList from '../containers/UsersList';
import UsersFilter from '../containers/UsersFilter';

const Users = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <UsersFilter />
      </View>
      <View style={styles.usersListContainer}>
        <UsersList navigation={navigation} />
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
    flex: 3,
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

export default Users;
