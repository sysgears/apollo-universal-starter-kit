import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import ClientCounter from './clientCounter';
import ServerCounter from './serverCounter';
import ReduxCounter from './reduxCounter';
import translate from '../../i18n';

const Counter = ({ t, loading, counter, subscribeToMore }) => (
  <View style={styles.container}>
    <ServerCounter t={t} loading={loading} subscribeToMore={subscribeToMore} counter={counter} />
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
  loading: PropTypes.bool.isRequired,
  counter: PropTypes.object,
  subscribeToMore: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('counter')(Counter);
