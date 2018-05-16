import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import { Loading } from '../../common/components/native';
import ClientCounter from '../clientCounter';
import ServerCounter from '../serverCounter';
import ReduxCounter from '../reduxCounter';

const CounterView = ({ t, loading, counter, subscribeToMore }) => {
  if (loading) {
    return <Loading text={t('loading')} />;
  } else {
    return (
      <View style={styles.container}>
        <ServerCounter t={t} loading={loading} subscribeToMore={subscribeToMore} counter={counter} />
        <ReduxCounter t={t} />
        <ClientCounter t={t} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 15
  }
});

CounterView.propTypes = {
  loading: PropTypes.bool.isRequired,
  counter: PropTypes.object,
  subscribeToMore: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default CounterView;
