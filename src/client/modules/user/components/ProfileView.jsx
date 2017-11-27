/*eslint-disable no-unused-vars*/
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

const ProfileView = ({ loading, currentUser }) => {
  if (loading && !currentUser) {
    return (
      <View style={styles.container}>
        <View style={styles.element}>
          <Text style={styles.box}>Loading...</Text>
        </View>
      </View>
    );
  } else if (currentUser) {
    return (
      <View style={styles.container}>
        <View style={styles.element}>
          <Text style={styles.box}>Hello {currentUser.username}!</Text>
        </View>
      </View>
    );
  }
};

ProfileView.propTypes = {
  loading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object
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

ProfileView.propTypes = {};

export default ProfileView;
