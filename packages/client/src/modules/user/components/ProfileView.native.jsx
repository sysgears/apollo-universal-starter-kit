/*eslint-disable no-unused-vars*/
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { Card, CardItem, CardText, CardTitle, CardHeader, CardLabel } from '../../common/components/native';
import SubscriptionProfile from '../../subscription/containers/SubscriptionProfile';

import settings from '../../../../../../settings';

const renderProfileItem = (title, value, idx) => (
  <CardItem key={idx}>
    <CardLabel>{title}</CardLabel>
    <CardText>{value}</CardText>
  </CardItem>
);

const ProfileView = ({ currentUserLoading, currentUser, navigation }) => {
  const profileItems = [
    {
      label: 'User Name: ',
      value: currentUser.username
    },
    {
      label: 'Email: ',
      value: currentUser.email
    },
    {
      label: 'Role: ',
      value: currentUser.role
    }
  ];

  if (currentUser.profile && currentUser.profile.fullName) {
    profileItems.push({ label: 'Full name', value: currentUser.profile.fullName });
  }

  return (
    <View style={styles.container}>
      {currentUserLoading ? (
        <Text style={styles.box}>Loading...</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.cardWrapper}>
            <Card>
              <CardHeader title="Profile info" />
              {profileItems.map((item, idx) => renderProfileItem(item.label, item.value, idx))}
            </Card>
          </View>
          <View style={styles.cardWrapper}>
            <Card>
              <CardHeader title="Subscription info" />
              <SubscriptionProfile />
            </Card>
          </View>
          <TouchableOpacity
            style={styles.linkWrapper}
            onPress={() => navigation.navigate('ProfileEdit', { id: currentUser.id })}
          >
            <Text style={styles.link}>Edit profile</Text>
          </TouchableOpacity>
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
  },
  cardWrapper: {
    marginBottom: 15
  },
  linkWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  link: {
    color: '#0056b3',
    fontSize: 16
  }
});

ProfileView.propTypes = {
  currentUserLoading: PropTypes.bool,
  currentUser: PropTypes.object,
  navigation: PropTypes.object
};

export default ProfileView;
