/*eslint-disable no-unused-vars*/
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { translate } from 'react-i18next';

const ProfileView = ({ t }) => {
  return (
    <View style={styles.container}>
      <View style={styles.element}>
        <Text style={styles.box}>{t('nativeMock')}</Text>
      </View>
    </View>
  );
};

ProfileView.propTypes = {
  t: PropTypes.func
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

export default translate('user')(ProfileView);
