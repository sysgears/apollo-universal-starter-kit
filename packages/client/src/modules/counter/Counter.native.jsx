import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import ClientCounter from './clientCounter';
import ServerCounter from './serverCounter';
import ReduxCounter from './reduxCounter';
import translate from '../../i18n';

const Counter = ({ t }) => (
  <View style={styles.container}>
    <ServerCounter t={t} />
    <ReduxCounter t={t} />
    <ClientCounter t={t} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 15
  }
});

Counter.propTypes = {
  t: PropTypes.func
};

export default translate('counter')(Counter);
