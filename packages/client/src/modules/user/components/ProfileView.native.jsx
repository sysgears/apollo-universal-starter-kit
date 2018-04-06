/*eslint-disable no-unused-vars*/
import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

import { Card, CardItem, CardText, CardTitle, CardHeader, CardLabel } from '../../common/components/native';
import SubscriptionProfile from '../../subscription/containers/SubscriptionProfile';

import { withLoadedUser } from '../';
import settings from '../../../../../../settings';

const renderProfileItem = (title, value) => (
  <CardItem>
    <CardLabel>{title}</CardLabel>
    <CardText>{value}</CardText>
  </CardItem>
);

const ProfileView = ({ currentUserLoading, currentUser }) => {
  return (
    <View style={styles.container}>
      {currentUserLoading ? (
        <Text style={styles.box}>Loading...</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Card>
            <CardHeader title="Profile info" />
            {renderProfileItem('User Name: ', currentUser.username)}
            {renderProfileItem('Email: ', currentUser.email)}
            {renderProfileItem('Role: ', currentUser.role)}
            {currentUser.profile && currentUser.profile.fullName
              ? renderProfileItem('Full Name: ', currentUser.profile.fullName)
              : null}
          </Card>
          <Card>
            <CardHeader title="Subscription info" />
            <SubscriptionProfile />
          </Card>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 10,
    paddingHorizontal: 20
  },
  container: {
    flex: 1
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
