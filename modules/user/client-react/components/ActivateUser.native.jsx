import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { translate } from '@gqlapp/i18n-client-react';

const ActivateUser = ({ t }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}> {t('activateUser')} </Text>
    </View>
  );
};

ActivateUser.propTypes = {
  t: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10
  },
  text: {
    paddingLeft: 10
  }
});
export default translate('user')(ActivateUser);
