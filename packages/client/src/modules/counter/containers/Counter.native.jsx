import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import ClientCounter from '../clientCounter/containers/ClientCounter';
import ServerCounter from '../serverCounter/containers/ServerCounter';
import ReduxCounter from '../reduxCounter/containers/ReduxCounter';
import translate from '../../../i18n/index';

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
