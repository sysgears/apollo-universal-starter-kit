/* eslint-disable no-unused-vars */
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { StripeSubscriptionProfile } from '@gqlapp/payments-client-react';
import { translate } from '@gqlapp/i18n-client-react';
import { Card, CardItem, CardText, CardHeader, CardLabel, Loading, lookStyles } from '@gqlapp/look-client-react-native';
import settings from '@gqlapp/config';

const renderProfileItem = (title, value, idx) => (
  <CardItem key={idx}>
    <CardLabel>{`${title}: `}</CardLabel>
    <CardText>{value}</CardText>
  </CardItem>
);

const ProfileView = ({ currentUserLoading, currentUser, navigation, t }) => {
  const profileItems = currentUser
    ? [
        {
          label: `${t('profile.card.group.name')}`,
          value: currentUser.username,
        },
        {
          label: `${t('profile.card.group.email')}`,
          value: currentUser.email,
        },
        {
          label: `${t('profile.card.group.role')}`,
          value: currentUser.role,
        },
      ]
    : [];

  if (currentUser && currentUser.profile && currentUser.profile.fullName) {
    profileItems.push({ label: `${t('profile.card.group.full')}`, value: currentUser.profile.fullName });
  }

  return (
    <View style={styles.container}>
      {currentUserLoading ? (
        <Loading text={t('profile.loadMsg')} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.cardWrapper}>
            <Card>
              <CardHeader title={t('profile.headerText')} />
              {profileItems.map((item, idx) => renderProfileItem(item.label, item.value, idx))}
            </Card>
          </View>
          <View style={styles.cardWrapper}>
            {/* Credit card info (Stripe subscription module) */}
            {settings.stripe.subscription.enabled &&
              settings.stripe.subscription.publicKey &&
              currentUser.role === 'user' && <StripeSubscriptionProfile />}
          </View>
          <TouchableOpacity
            style={styles.linkWrapper}
            onPress={() => navigation.navigate('ProfileEdit', { id: currentUser.id })}
          >
            <Text style={styles.linkText}>{t('profile.editProfileText')}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
  },
  cardWrapper: {
    marginBottom: 15,
  },
  linkWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: lookStyles.linkText,
});

ProfileView.propTypes = {
  currentUserLoading: PropTypes.bool,
  currentUser: PropTypes.object,
  navigation: PropTypes.object,
  t: PropTypes.func,
};

export default translate('user')(ProfileView);
