/*eslint-disable no-unused-vars*/
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import { withLoadedUser } from '../';

const ProfileView = ({ currentUserLoading, currentUser }) => {
  return (
    <View style={styles.container}>
      <View style={styles.element}>
        {currentUserLoading ? (
          <Text style={styles.box}>Loading...</Text>
        ) : (
          <Text style={styles.box}>
            Hello User {currentUser ? currentUser.fullName || currentUser.username : null}!
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  element: {
    paddingTop: 30
  },
  box: {
    textAlign: 'center',
    marginLeft: 15,
    marginRight: 15
  }
});

ProfileView.propTypes = {
  currentUserLoading: PropTypes.bool,
  currentUser: PropTypes.object
};

export default ProfileView;
